const { SubFunds, Funds } = require('../config/database');
const {getAllWithAssociations}=require("../models/associatedDependency");
const db=require('../config/database');
const e = require('express');
const { Op } = require("sequelize");
const generateLinkID = require("../utils/generateID")

exports.saveData = async (req, res) => {
  const {
    ID,
    Code,
    Name,
    Description,
    Amount,
    FundsID,
  } = req.body;
  let { IsNew } = req.body;

  try {
    if((IsNew == "true") || (IsNew === true) || (IsNew == '1') || (IsNew == 1)) {
      IsNew = true;
    }
    else if((IsNew == "false") || (IsNew === false) || (IsNew == '0') || (IsNew == 0)) {
      IsNew = false;
    }
    else {
      throw new Error('Invalid value for IsNew. Expected true or false.');
    }

    const amount = parseFloat(Amount);
    const duplicateWhere = {
      [Op.and]: [
        {
          [Op.or]: [
            { Code: Code },
            { Name: Name }
          ]
        },
        { Description: Description },
        { Amount: amount },
        { FundsID: FundsID },
        { Active: true }
      ]
    };

    // If updating, exclude the current ID
    if (!IsNew) {
      duplicateWhere[Op.and].push({ ID: { [Op.ne]: ID } });
    }

    const duplicateCheck = await SubFunds.findOne({where: duplicateWhere});

    if (duplicateCheck) {
      return res.status(409).json({ message: 'Code or Name already exists.' });
    }

    if (IsNew) {
      // Add new
      const LinkID = generateLinkID();
      await SubFunds.create({
        LinkID,
        Code: Code,
        Name: Name,
        Description: Description,
        Amount: amount,
        FundsID: FundsID,
        Active: true,
      });
    } else {
      // Update existing
      await SubFunds.update(
        {
          Code: Code,
          Name: Name,
          Description: Description,
          Amount: amount,
          FundsID: FundsID,
        },
        {
          where: { ID: ID }
        }
      );
    }

    res.status(200).json({ message: 'success' });

  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: error.message });
  }
};




exports.create = async (req, res) => {
  try {
    const { LinkID, Code, Name, Description, Amount, FundsID, Active } = req.body;
    const item = await SubFunds.create({ LinkID, Code, Name, Description, Amount, FundsID, Active });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const records = await SubFunds.findAll({
      attributes: ['ID', 'Code', 'Name', 'Description', 'Amount', 'FundsID'],
      include: [
        {
          model: Funds,
          as: 'Funds',
          required: false
        }
      ],
      where: { Active: true },
      order: [['Name', 'ASC']]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await SubFunds.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "SubFunds not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, Code, Name, Description, Amount, FundsID, Active } = req.body;
    const [updated] = await SubFunds.update({ LinkID, Code, Name, Description, Amount, FundsID, Active }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await SubFunds.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "SubFunds not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await SubFunds.update(
      { Active: false },
      { where: { ID: id } }
    );

    res.json({ message: 'success.' });
  } catch (err) {
    console.error('Error deleting fund:', err);
    res.status(500).json({ error: err.message });
  }
};