const { citizensRegistration } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Picture, Suffix, FirstName, MiddleName, LastName, BirthDate, MobileNumber, EmailAddress, MothersMaidenName, CivilStatus, ValidID, IDNumber, FrontID, BackID, Active, CreatedBy, CreatedDate } = req.body;
    const item = await citizensRegistration.create({ Picture, Suffix, FirstName, MiddleName, LastName, BirthDate, MobileNumber, EmailAddress, MothersMaidenName, CivilStatus, ValidID, IDNumber, FrontID, BackID, Active, CreatedBy, CreatedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await citizensRegistration.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await citizensRegistration.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "citizensRegistration not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Picture, Suffix, FirstName, MiddleName, LastName, BirthDate, MobileNumber, EmailAddress, MothersMaidenName, CivilStatus, ValidID, IDNumber, FrontID, BackID, Active, CreatedBy, CreatedDate } = req.body;
    const [updated] = await citizensRegistration.update({ Picture, Suffix, FirstName, MiddleName, LastName, BirthDate, MobileNumber, EmailAddress, MothersMaidenName, CivilStatus, ValidID, IDNumber, FrontID, BackID, Active, CreatedBy, CreatedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await citizensRegistration.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "citizensRegistration not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await citizensRegistration.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "citizensRegistration deleted" });
    else res.status(404).json({ message: "citizensRegistration not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};