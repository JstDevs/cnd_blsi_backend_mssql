const { Customer, employee, CommunityTax, documentType, TransactionItems, TransactionTable } = require('../config/database');
const { Op, literal } = require('sequelize');
const db = require('../config/database')
const { getAllWithAssociations } = require("../models/associatedDependency");
const generateLinkID = require("../utils/generateID")
const getLatestApprovalVersion = require('../utils/getLatestApprovalVersion');

async function saveCustomerAndCTC(req, res) {
  const t = await db.sequelize.transaction();
  try {
    const data = req.body;

    let IsNew = '';
    if ((data.IsNew == "true") || (data.IsNew === true) || (data.IsNew == '1') || (data.IsNew == 1)) {
      IsNew = true;
    }
    else if ((data.IsNew == "false") || (data.IsNew === false) || (data.IsNew == '0') || (data.IsNew == 0)) {
      IsNew = false;
    }
    else {
      throw new Error('Invalid value for IsNew. Expected true or false.');
    }

    let IsSelectedFromIndividual = '';
    if ((data.IsSelectedFromIndividual == "true") || (data.IsSelectedFromIndividual === true) || (data.IsSelectedFromIndividual == '1') || (data.IsSelectedFromIndividual == 1)) {
      IsSelectedFromIndividual = true;
    }
    else if ((data.IsSelectedFromIndividual == "false") || (data.IsSelectedFromIndividual === false) || (data.IsSelectedFromIndividual == '0') || (data.IsSelectedFromIndividual == 0)) {
      IsSelectedFromIndividual = false;
    }
    else {
      throw new Error('Invalid value for IsSelectedFromIndividual. Expected true or false.');
    }

    const docID = 5
    const requiredFields = [data.Year, data.LastName, data.FirstName, data.Address, data.Citizenship];
    if (requiredFields.some(f => !f || f.trim() === '')) {
      return res.status(400).json({ message: 'Please fill up all required fields.' });
    }

    // const height = Number(data.HeightFeet) * 12 + Number(data.HeightInches);
    const height = Number(data.Height);

    const cleanedAddress = data.Address.replace(/(,\s*)+$/, '');

    let customerId = null;
    const refID = generateLinkID();

    if (IsNew && !IsSelectedFromIndividual) {
      const customer = await Customer.create({
        FirstName: data.FirstName,
        MiddleName: data.MiddleName,
        LastName: data.LastName,
        CivilStatus: data.CivilStatus,
        PlaceofBirth: data.PlaceOfBirth,
        Gender: data.Gender,
        Height: parseFloat(data.Height) || null,
        Weight: parseFloat(data.Weight) || null,
        Birthdate: data.BirthDate || null,
        Citizenship: data.Citizenship,
        ICRNumber: data.ICRNo || null,
        Occupation: data.Profession,
        Type: 'Individual',
        StreetAddress: cleanedAddress,
        TIN: data.TIN || null,
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE')
      }, { transaction: t });
      customerId = customer.ID;
    } else if (
      (IsSelectedFromIndividual && data.CustomerID)
    ) {
      await Customer.update({
        FirstName: data.FirstName,
        MiddleName: data.MiddleName,
        LastName: data.LastName,
        CivilStatus: data.CivilStatus,
        PlaceofBirth: data.PlaceOfBirth,
        Gender: data.Gender,
        Height: parseFloat(data.Height) || null,
        Weight: parseFloat(data.Weight) || null,
        Birthdate: data.BirthDate || null,
        Citizenship: data.Citizenship,
        ICRNumber: data.ICRNo || null,
        Occupation: data.Profession,
        Type: 'Individual',
        TIN: data.TIN || null,
        ModifyBy: req.user.id,
        ModifyDate: db.sequelize.fn('GETDATE'),
      }, { where: { ID: data.CustomerID }, transaction: t });
      customerId = data.CustomerID;
    }

    // const documentTypeRecord = await documentType.findByPk(docID);
    // if(!documentTypeRecord) {
    //   return res.status(404).json({ success: false, message: 'Document type not found' });
    // }

    let statusValue = '';
    const matrixExists = await db.ApprovalMatrix.findOne({
      where: {
        DocumentTypeID: docID,
        Active: 1,
      },
      transaction: t
    });
    statusValue = matrixExists ? 'Requested' : 'Posted';

    const latestapprovalversion = await getLatestApprovalVersion('Community Tax');

    if (IsNew) {
      await TransactionTable.create({
        LinkID: refID,
        APAR: 'Community Tax Certificate',
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID || null,
        CustomerID: customerId,
        CustomerName: `${data.FirstName} ${data.MiddleName} ${data.LastName}`,
        PlaceIssued: data.Municipality,
        InvoiceDate: data.DateIssued || null,
        TIN: data.TIN || null,
        InvoiceNumber: data.CCNumber,
        Total: parseFloat(data.Total) || 0,
        AmountReceived: parseFloat(data.AmountPaid) || 0,
        Remarks: data.Remarks,
        Status: statusValue,
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: db.sequelize.fn('GETDATE'),
        BusinessEarnings: parseFloat(data.InputOne) || 0,
        OccupationEarnings: parseFloat(data.InputTwo) || 0,
        IncomeProperty: parseFloat(data.InputThree) || 0,
        BusinessTaxDue: parseFloat(data.OutputOne) || 0,
        OccupationTaxDue: parseFloat(data.OutputTwo) || 0,
        PropertyTaxDue: parseFloat(data.OutputThree) || 0,
        Interest: parseFloat(data.Interest) || 0,
        BasicTax: parseFloat(data.BasicTax) || 0,
        Year: data.Year,
        Credit: data.Total,
        Debit: data.Total,
        AmountInWords: data.Words,
        ApprovalProgress: 0,
        ApprovalVersion: latestapprovalversion,
        FundsID: 1
      }, { transaction: t });

      await documentType.increment(
        { CurrentNumber: 1 },
        {
          where: { ID: docID },
          transaction: t
        }
      );
    } else {
      const existingRecord = await TransactionTable.findOne({
        where: { ID: data.ID },
        transaction: t
      });

      if (!existingRecord) {
        throw new Error('Record not found.');
      }

      await TransactionTable.update({
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID || null,
        CustomerID: customerId,
        CustomerName: `${data.FirstName} ${data.MiddleName} ${data.LastName}`,
        PlaceIssued: data.Municipality,
        InvoiceDate: data.DateIssued || null,
        TIN: data.TIN || null,
        Total: parseFloat(data.Total) || 0,
        AmountReceived: parseFloat(data.AmountPaid) || 0,
        Remarks: data.Remarks,
        Active: true,
        ModifyBy: req.user.id,
        ModifyDate: db.sequelize.fn('GETDATE'),
        BusinessEarnings: parseFloat(data.InputOne) || 0,
        OccupationEarnings: parseFloat(data.InputTwo) || 0,
        IncomeProperty: parseFloat(data.InputThree) || 0,
        BusinessTaxDue: parseFloat(data.OutputOne) || 0,
        OccupationTaxDue: parseFloat(data.OutputTwo) || 0,
        PropertyTaxDue: parseFloat(data.OutputThree) || 0,
        Interest: parseFloat(data.Interest) || 0,
        BasicTax: parseFloat(data.BasicTax) || 0,
        Year: data.Year,
        Credit: parseFloat(data.Total) || 0,
        Debit: parseFloat(data.Total) || 0,
        AmountInWords: data.Words,
        ApprovalVersion: latestapprovalversion
      }, { where: { ID: data.ID }, transaction: t });

      await TransactionItems.destroy({
        where: { LinkID: existingRecord.LinkID },
        transaction: t
      });
    }

    await t.commit();
    res.status(201).json({ message: 'success' });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

function parseHeight(input) {
  if (!input) return null;
  if (input.includes("'")) {
    const [feet, inches] = input.split("'").map(s => parseInt(s.trim(), 10));
    if (!isNaN(feet) && !isNaN(inches)) return feet * 12 + inches;
    return null;
  }
  return isNaN(parseInt(input)) ? null : parseInt(input);
}

function mapCivilStatus(status) {
  switch (status) {
    case 'Single': return 'Single';
    case 'Married': return 'Married';
    case 'Widow': return 'Widow/Widower/Legally Seperated';
    case 'Divorced': return 'Divorced';
    default: return '';
  }
}


exports.getall = async (req, res) => {
  try {
    const records = await TransactionTable.findAll({
      where: {
        Active: true,
        APAR: { [Op.like]: '%Community Tax%' }
      },
      attributes: {
        include: [
          // Add Customer Full Name
          [literal(`CONCAT(Customer.FirstName, ' ', Customer.MiddleName, ' ', Customer.LastName)`), 'CustomerFullName'],
          // Add Employee Full Name
          [literal(`CONCAT(RequestedByEmployee.FirstName, ' ', RequestedByEmployee.MiddleName, ' ', RequestedByEmployee.LastName)`), 'Employee']
        ]
      },
      include: [
        {
          model: Customer,
          as: 'Customer',
          require: false,
        },
        {
          model: employee,
          as: 'RequestedByEmployee',
          require: false,
        },
      ],
      order: [['CreatedDate', 'DESC']]
    });

    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch data' });
  }
}


exports.deleteCustomerCTC = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error('Missing CTC ID to delete.');
    }

    await TransactionTable.update({
      Status: 'Void',
      ModifyDate: db.sequelize.fn('GETDATE'), // Use ModifyDate instead of CreatedDate for voiding
      ModifyBy: req.user.id,
    },
      {
        where: { ID: id }
      });

    res.json({ message: "success" });
  } catch (err) {
    console.error('❌ Error deleting CTC:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCurrentNumber = async (req, res) => {
  try {
    const record = await documentType.findOne({
      where: {
        ID: 5,
        Active: 1
      },
      attributes: ['CurrentNumber']
    });

    if (!record) {
      return res.status(404).json({ message: 'Document type not found or inactive' });
    }

    const incrementedValue = Number(record.CurrentNumber) + 1;

    res.status(200).json({ CurrentNumber: incrementedValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch current number' });
  }
};


exports.saveCustomerAndCTC = saveCustomerAndCTC