// routes/corporateCtc.js


const db = require('../config/database');
const { sequelize, Customer, employee, TransactionTable, TransactionItems, documentType, industryType } = require('../config/database');
const IndustryType = industryType
const { getAllWithAssociations } = require("../models/associatedDependency");
const generateLinkID = require("../utils/generateID")
const getLatestApprovalVersion = require('../utils/getLatestApprovalVersion');
const { Op, literal } = require('sequelize');

exports.save = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const data = req.body;

    let IsNew = '';
    let IsSelectedFromIndividual = '';
    if ((data.IsNew == "true") || (data.IsNew === true) || (data.IsNew == '1') || (data.IsNew == 1)) {
      IsNew = true;
    }
    else if ((data.IsNew == "false") || (data.IsNew === false) || (data.IsNew == '0') || (data.IsNew == 0)) {
      IsNew = false;
    }
    else {
      throw new Error('Invalid value for IsNew. Expected true or false.');
    }

    if ((data.IsSelectedFromIndividual == "true") || (data.IsSelectedFromIndividual === true) || (data.IsSelectedFromIndividual == '1') || (data.IsSelectedFromIndividual == 1)) {
      IsSelectedFromIndividual = true;
    }
    else if ((data.IsSelectedFromIndividual == "false") || (data.IsSelectedFromIndividual === false) || (data.IsSelectedFromIndividual == '0') || (data.IsSelectedFromIndividual == 0)) {
      IsSelectedFromIndividual = false;
    }
    else {
      throw new Error('Invalid value for IsSelectedFromIndividual. Expected true or false.');
    }

    const docID = 27;

    const cleanedAddress = data.Address.replace(/(,\s*)+$/, '');

    const refID = generateLinkID();

    // generate vendor code
    const vendorName = data.Name?.trim();
    let codePrefix = vendorName.length >= 3
      ? vendorName.substring(0, 3).toUpperCase()
      : vendorName.toUpperCase().padEnd(3, 'X');
    const randomDigits = Math.floor(Math.random() * 900) + 100; // 100 to 999
    const generatedVendorCode = codePrefix + randomDigits;

    // generate industry type ID
    const [industryTypeRecord, created] = await IndustryType.findOrCreate({
      where: { Name: 'N/A' },
      defaults: {
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: new Date()
      }
    });
    const industryTypeId = industryTypeRecord.ID;

    let customerId = null;
    if (IsNew && !IsSelectedFromIndividual) {
      const customer = await Customer.create({
        Code: generatedVendorCode,
        Name: data.Name,
        PaymentTermsID: 1,
        PaymentMethodID: 1,
        TIN: data.TIN,
        TaxCodeID: 1,
        TypeID: 1,
        IndustryTypeID: industryTypeId,
        ContactPerson: "",
        PhoneNumber: "",
        MobileNumber: "",
        EmailAddress: "",
        Website: "",
        StreetAddress: cleanedAddress,
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: new Date(),
        Type: 'Corporate',
        PlaceofIncorporation: data.PlaceofIncorporation,
        KindofOrganization: data.KindofOrganization,
        DateofRegistration: new Date(),
      }, { transaction: t });
      customerId = customer.ID;
    } else if (
      (IsSelectedFromIndividual && data.CustomerID)
    ) {
      await Customer.update({
        Name: data.Name,
        TIN: data.TIN,
        PlaceofIncorporation: data.PlaceofIncorporation,
        KindofOrganization: data.KindofOrganization,
        Type: 'Corporate',
        ModifyBy: req.user.id,
        ModifyDate: new Date(),
      }, { where: { ID: data.CustomerID }, transaction: t });
      customerId = data.CustomerID;
    }

    const latestapprovalversion = await getLatestApprovalVersion('Community Tax');

    if (IsNew) {
      await TransactionTable.create({
        LinkID: refID,
        APAR: 'Community Tax Certificate Corporation',
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID,
        CustomerID: customerId,
        CustomerName: data.Name,
        PlaceIssued: data.PlaceIssued,
        InvoiceDate: data.DateIssued,
        TIN: data.TIN,
        InvoiceNumber: data.CCNumber,
        Total: data.Total,
        AmountReceived: data.AmountPaid,
        Remarks: data.Remarks,
        Status: 'Requested',
        Active: true,
        CreatedBy: req.user.id,
        CreatedDate: new Date(),
        BusinessEarnings: parseFloat(data.InputOne) || 0,
        OccupationEarnings: parseFloat(data.InputTwo) || 0,
        BusinessTaxDue: parseFloat(data.OutputOne) || 0,
        OccupationTaxDue: parseFloat(data.OutputTwo) || 0,
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
      await TransactionTable.update({
        DocumentTypeID: docID,
        RequestedBy: req.user.employeeID,
        CustomerID: customerId,
        CustomerName: data.Name,
        PlaceIssued: data.PlaceIssued,
        InvoiceDate: data.DateIssued,
        TIN: data.TIN,
        Total: data.Total,
        AmountReceived: data.AmountPaid,
        Remarks: data.Remarks,
        Active: true,
        ModifyBy: req.user.id,
        ModifyDate: new Date(),
        BusinessEarnings: parseFloat(data.InputOne) || 0,
        OccupationEarnings: parseFloat(data.InputTwo) || 0,
        BusinessTaxDue: parseFloat(data.OutputOne) || 0,
        OccupationTaxDue: parseFloat(data.OutputTwo) || 0,
        Interest: parseFloat(data.Interest) || 0,
        BasicTax: parseFloat(data.BasicTax) || 0,
        Year: data.Year,
        Credit: data.Total,
        Debit: data.Total,
        AmountInWords: data.Words,
        ApprovalVersion: latestapprovalversion
      }, { where: { ID: data.ID }, transaction: t });

      await TransactionItems.destroy({
        where: { LinkID: refID },
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
};


exports.getAll = async (req, res) => {
  try {
    const records = await TransactionTable.findAll({
      where: {
        Active: true,
        APAR: { [Op.like]: '%Community Tax Certificate Corporation%' }
      },
      attributes: {
        include: [
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

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error('Missing CTC ID to delete.');
    }

    await TransactionTable.update({
      Status: 'Void',
      CreatedDate: new Date(),
      CreatedBy: req.user.id,
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

exports.approve = async (req, res) => {
  const { ID } = req.body;
  const id = ID;

  const t = await db.sequelize.transaction();
  try {
    const trx = await TransactionTable.findOne({ where: { ID: id }, transaction: t });
    if (!trx) return res.status(404).json({ error: 'Transaction not found' });

    const approvalProgress = Number(trx.ApprovalProgress) || 0;

    await trx.update({ ApprovalProgress: approvalProgress + 1, Status: 'Posted' }, { transaction: t });

    await db.ApprovalAudit.create({
      LinkID: trx.LinkID,
      InvoiceLink: trx.LinkID,
      PositionorEmployee: 'Employee',
      PositionorEmployeeID: req.user?.employeeID || null,
      SequenceOrder: approvalProgress,
      ApprovalDate: new Date(),
      CreatedBy: req.user?.id || null,
      CreatedDate: new Date(),
      ApprovalVersion: trx.ApprovalVersion
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Approved successfully' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.reject = async (req, res) => {
  const { ID } = req.body;
  const id = ID;

  const t = await db.sequelize.transaction();
  try {
    const trx = await TransactionTable.findOne({ where: { ID: id }, transaction: t });
    if (!trx) return res.status(404).json({ error: 'Transaction not found' });

    await trx.update({ Status: 'Rejected', ApprovalProgress: 0 }, { transaction: t });

    await db.ApprovalAudit.create({
      LinkID: trx.LinkID,
      InvoiceLink: trx.LinkID,
      RejectionDate: new Date(),
      Remarks: req.body.reason || '',
      CreatedBy: trx.CreatedBy,
      CreatedDate: new Date(),
      ApprovalVersion: trx.ApprovalVersion
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Transaction rejected successfully' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
