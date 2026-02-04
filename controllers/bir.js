const { sequelize } = require('../config/database');
const { QueryTypes, Op } = require('sequelize');
const db = require("../config/database")
exports.getGeneralJournal = async (req, res) => {
  const { startDate, endDate, fundID, code } = req.body;

  try {
    // const results = await sequelize.query(`
    //   SELECT 
    //     UPPER(lmu.Name) AS Municipality,
    //     CASE
    //       WHEN :fundID = '%'
    //       THEN 'All Funds'
    //       ELSE glg.FundName
    //     END AS Funds,
    //     :startDate AS StartDate,
    //     :endDate AS EndDate,
    //     trt.InvoiceDate,
    //     trt.InvoiceNumber,
    //     trt.Remarks,
    //     REPLACE(glg.AccountCode, '-', '') AS AccountCode,
    //     'S/L' AS SL,
    //     glg.Debit,
    //     glg.Credit,
    //     CONCAT(apr.FirstName, ' ', LEFT(apr.MiddleName, 1), '. ', apr.LastName) AS Approver,
    //     pos.Name AS Position,
    //     MAX(apa.ApprovalOrder) AS a
    //   FROM TransactionTable trt
    //   INNER JOIN GeneralLedger glg ON glg.LinkID = trt.LinkID
    //   LEFT JOIN ApprovalAudit apa ON apa.InvoiceLink = trt.LinkID
    //   LEFT JOIN Employee apr ON apr.ID = apa.PositionorEmployeeID
    //   LEFT JOIN Position pos ON pos.ID = apr.PositionID
    //   INNER JOIN LGU lgu ON lgu.ID = 1
    //   INNER JOIN Municipality lmu ON lmu.ID = lgu.MunicipalityID
    //   WHERE (trt.APAR = 'Journal Entry Voucher' OR trt.APAR = 'Disbursement Voucher')
    //     AND trt.InvoiceDate >= :startDate
    //     AND trt.InvoiceDate <= :endDate
    //     AND CONCAT(glg.FundID, '') LIKE :fundID
    //     AND apa.SequenceOrder = 0
    //     AND glg.AccountCode LIKE :code
    //   GROUP BY 
    //     trt.InvoiceDate,
    //     trt.InvoiceNumber,
    //     trt.Remarks,
    //     glg.AccountCode,
    //     glg.Debit,
    //     glg.Credit,
    //     apr.FirstName,
    //     apr.MiddleName,
    //     apr.LastName,
    //     pos.Name,
    //     lmu.Name,
    //     glg.FundName
    //   ORDER BY trt.LinkID, trt.InvoiceDate ASC, glg.Debit DESC
    // `, {
    //   replacements: { startDate, endDate, fundID, code },
    //   type: QueryTypes.SELECT
    // });
    const municipality = await db.Lgu.findOne({
      where: { id: 1 },
      include: [{
        model: db.municipality,
        as: 'Municipality'
      }]
    });
    const municipalityName = municipality ? municipality.Municipality.Name : 'Unknown Municipality';
    const results = await db.TransactionTable.findAll({
      where: {
        APAR: {
          [Op.in]: ['Journal Entry Voucher', 'Disbursement Voucher']
        },
        InvoiceDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: db.GeneralLedger,
          as: 'GeneralLedger',
          where: {
            FundID: fundID,
            AccountCode: code
          },
          attributes: [
            [sequelize.fn('REPLACE', sequelize.col('GeneralLedger.AccountCode'), '-', ''), 'AccountCode'],
            'Debit',
            'Credit',
            'FundName'
          ]
        },
        {
          model: db.ApprovalAudit,
          as: "ApprovalAudit",
          // where: { SequenceOrder: 0 },
          // required: false,
          include: [
            {
              model: db.employee,
              as: 'Employee',
              include: [{ model: db.position, as: 'Position' }]
            }
          ]
        },

      ],
      // order: [
      //   ['LinkID', 'ASC'],
      //   ['InvoiceDate', 'ASC'],
      //   [db.GeneralLedger, 'Debit', 'DESC']
      // ],
      attributes: [
        //  [
        //   sequelize.literal(`(
        //     SELECT UPPER(m.Name)
        //     FROM LGU l
        //     JOIN Municipality m ON m.ID = l.MunicipalityID
        //     WHERE l.ID = 1
        //     LIMIT 1
        //   )`),
        //   'Municipality'
        // ],
        'InvoiceDate',
        'InvoiceNumber',
        'Remarks',
        [sequelize.col('ApprovalAudit.Employee.FirstName'), 'FirstName'],
        [sequelize.col('ApprovalAudit.Employee.MiddleName'), 'MiddleName'],
        [sequelize.col('ApprovalAudit.Employee.LastName'), 'LastName'],

        [sequelize.literal(`CASE WHEN '${fundID}' = '%' THEN 'All Funds' ELSE GeneralLedger.FundName END`), 'Funds'],
        [sequelize.literal(`'${startDate}'`), 'StartDate'],
        [sequelize.literal(`'${endDate}'`), 'EndDate'],
        [sequelize.literal(`'S/L'`), 'SL'],
        // [sequelize.literal(`CONCAT(ApprovalAudit.Employee.FirstName, ' ', LEFT(ApprovalAudit.Employee.MiddleName, 1), '. ', ApprovalAudit.Employee.LastName)`), 'Approver'],
        [sequelize.col('ApprovalAudit.Employee.Position.Name'), 'Position'],
        [sequelize.fn('MAX', sequelize.col('ApprovalAudit.ApprovalOrder')), 'a']
      ],
      group: [
        'InvoiceDate',
        'InvoiceNumber',
        'Remarks',
        'GeneralLedger.AccountCode',
        'GeneralLedger.Debit',
        'GeneralLedger.Credit',
        'GeneralLedger.FundName',
        'ApprovalAudit.Employee.FirstName',
        'ApprovalAudit.Employee.MiddleName',
        'ApprovalAudit.Employee.LastName',
        'ApprovalAudit.Employee.Position.Name',
        // 'Municipality.Name'
      ],
      raw: true
    });
    const finalResults = results.map(r => ({
      ...r,
      Municipality: municipalityName,
      Approver: `${r.FirstName} ${r.MiddleName || ''}. ${r.LastName}`

    }));

    res.json(finalResults);
  } catch (err) {
    console.error('Error fetching general journal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.print2307Vendor = async (req, res) => {
  const { dateFrom, dateTo, vendorID } = req.body;

  try {
    const result = await sequelize.query(
      `EXEC SP_2307_vendor :dateFrom, :dateTo, :vendorID`,
      {
        replacements: { dateFrom, dateTo, vendorID },
        type: QueryTypes.SELECT
      }
    );
    res.json(result);
  } catch (err) {
    console.error('Error printing 2307 vendor:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.print2307Employee = async (req, res) => {
  const { dateFrom, dateTo, employeeID } = req.body;

  try {
    const result = await sequelize.query(
      `EXEC SP_2307_employee :dateFrom, :dateTo, :vendorID`,
      {
        replacements: { dateFrom, dateTo, vendorID: employeeID },
        type: QueryTypes.SELECT
      }
    );
    res.json(result);
  } catch (err) {
    console.error('Error printing 2307 employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.view = async (req, res) => {
  try {
    // Accept the same inputs from client
    const {
      DateFrom,
      DateTo,
      vendorID,
      employeeID
    } = req.body;

    // vendorIDValue = If(String.IsNullOrEmpty(vendorID), employeeID, vendorID)
    const vendorIDValue = (vendorID === undefined || vendorID === null || String(vendorID).trim() === '')
      ? employeeID
      : vendorID;

    // Call stored procedure (MySQL/ MariaDB style CALL)
    const results = await sequelize.query(
      'CALL SP_GeneralJournal(:DateFrom, :DateTo, :vendorID)',
      {
        replacements: { DateFrom, DateTo, vendorID: vendorIDValue },
      }
    );

    return res.json(results);
  } catch (err) {
    console.error('Error in generalJournal:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
};
