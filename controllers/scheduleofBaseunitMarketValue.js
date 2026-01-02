const { ScheduleofBaseunitMarketValue } = require('../config/database');
const { Op } = require('sequelize');
const scheduleofBaseunitMarketValue = ScheduleofBaseunitMarketValue;

exports.create = async (req, res) => {
  try {
    const { GeneralRevisionYear, Classification, Location, Unit, ActualUse, SubClassification, Price, Createdby } = req.body;

    const CreatedDate = req.body.CreatedDate || new Date().toISOString().slice(0,10);
    const Modifiedby = req.body.Modifiedby || null;
    const ModifiedDate = req.body.ModifiedDate || null;
    const UsingStatus = req.body.UsingStatus || null;
    // Ensure Active defaults to true when not provided
    const Active = (req.body.Active !== undefined && req.body.Active !== null) ? req.body.Active : true;

    const item = await scheduleofBaseunitMarketValue.create({ GeneralRevisionYear, Classification, Location, Unit, ActualUse, SubClassification, Price, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await scheduleofBaseunitMarketValue.findAll({
      where: {
        [Op.or]: [{ Active: true }, { Active: null }]
      }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await scheduleofBaseunitMarketValue.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "scheduleofBaseunitMarketValue not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { GeneralRevisionYear, Classification, Location, Unit, ActualUse, SubClassification, Price, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus } = req.body;
    const [updated] = await scheduleofBaseunitMarketValue.update({ GeneralRevisionYear, Classification, Location, Unit, ActualUse, SubClassification, Price, Createdby, CreatedDate, Modifiedby, ModifiedDate, Active, UsingStatus }, {
      where: { ID: req.params.id }
    });
    if (updated) {
      const updatedItem = await scheduleofBaseunitMarketValue.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "scheduleofBaseunitMarketValue not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const modifiedBy = req.user?.id ? String(req.user.id) : null;
    const modifiedDate = new Date().toISOString().slice(0,10);

    const [updated] = await scheduleofBaseunitMarketValue.update(
      { Active: false, Modifiedby: modifiedBy, ModifiedDate: modifiedDate },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "scheduleofBaseunitMarketValue deactivated" });
    else res.status(404).json({ message: "scheduleofBaseunitMarketValue not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};