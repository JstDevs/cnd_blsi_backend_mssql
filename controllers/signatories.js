const db = require('../config/database');
const signatories = db.Signatories;
const path = require('path');

exports.create = async (req, res) => {
  try {
    const { DocumentTypeID, EmployeeID, SequenceNumber } = req.body;

    // Manual ID increment
    const maxItem = await signatories.findOne({ order: [['ID', 'DESC']] });
    const nextID = (maxItem ? parseInt(maxItem.ID) : 0) + 1;

    const item = await signatories.create({ ID: nextID, DocumentTypeID, EmployeeID, SequenceNumber });
    res.status(201).json(item);
  } catch (err) {
    console.error('Signatories create error:', err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      sql: err.parent ? err.parent.sql : null
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const docTypes = await db.documentType.findAll({
      order: [['Name', 'ASC']],
    });

    const rawItems = await signatories.findAll({
      include: [
        { model: db.employee, as: 'Signatory', attributes: ['FirstName', 'LastName'] },
      ],
    });

    // Pivot logic: Group by DocumentTypeID for the frontend
    const results = docTypes.map(doc => {
      const docSignatories = rawItems.filter(s => s.DocumentTypeID == doc.ID);

      const result = {
        ID: docSignatories.length > 0 ? docSignatories[0].DocumentTypeID : `new-${doc.ID}`, // Using DocumentTypeID or virtual ID
        DocumentTypeID: doc.ID,
        DocumentType: { Name: doc.Name },
        EmployeeOne: null,
        EmployeeTwo: null,
        EmployeeThree: null,
        EmployeeFour: null,
        EmployeeFive: null
      };

      docSignatories.forEach(item => {
        const seq = item.SequenceNumber;
        if (seq === 1) result.EmployeeOne = item.EmployeeID;
        else if (seq === 2) result.EmployeeTwo = item.EmployeeID;
        else if (seq === 3) result.EmployeeThree = item.EmployeeID;
        else if (seq === 4) result.EmployeeFour = item.EmployeeID;
        else if (seq === 5) result.EmployeeFive = item.EmployeeID;
      });

      return result;
    });

    res.json(results);
  } catch (err) {
    console.error('Signatories getAll error:', err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      sql: err.parent ? err.parent.sql : null
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await signatories.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "signatories not found" });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

exports.update = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    // The frontend sends the "pivoted" object
    const { DocumentTypeID, EmployeeOne, EmployeeTwo, EmployeeThree, EmployeeFour, EmployeeFive } = req.body;

    if (!DocumentTypeID) {
      throw new Error("DocumentTypeID is required");
    }

    // Delete existing signatories for this document type
    await signatories.destroy({
      where: { DocumentTypeID },
      transaction
    });

    // Insert new ones based on the fields sent by the frontend
    const employees = [EmployeeOne, EmployeeTwo, EmployeeThree, EmployeeFour, EmployeeFive];

    // Get starting ID
    const maxItem = await signatories.findOne({ order: [['ID', 'DESC']], transaction });
    let nextID = (maxItem ? parseInt(maxItem.ID) : 0) + 1;

    for (let i = 0; i < employees.length; i++) {
      if (employees[i]) {
        await signatories.create({
          ID: nextID++,
          DocumentTypeID,
          EmployeeID: employees[i],
          SequenceNumber: i + 1
        }, { transaction });
      }
    }

    await transaction.commit();
    res.json({ message: "Signatories updated successfully" });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Signatories update error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

exports.delete = async (req, res) => {
  try {
    // For delete, we might want to delete ALL signatories for that document type if ID refers to the grouped row
    // But usually frontend deletes by row ID.
    const deleted = await signatories.destroy({ where: { ID: req.params.id } });
    if (deleted) res.json({ message: "signatories deleted" });
    else res.status(404).json({ message: "signatories not found" });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};