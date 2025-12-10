const { approvalMatrixTemp } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, DocumentTypeID, Version, SequenceLevel, AllorMajority, NumberofApprover, Active, CreatedBy, CreatedDate, AlteredBy, AlteredDate } = req.body;
    const item = await approvalMatrixTemp.create({ LinkID, DocumentTypeID, Version, SequenceLevel, AllorMajority, NumberofApprover, Active, CreatedBy, CreatedDate, AlteredBy, AlteredDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await approvalMatrixTemp.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await approvalMatrixTemp.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "approvalMatrixTemp not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, DocumentTypeID, Version, SequenceLevel, AllorMajority, NumberofApprover, Active, CreatedBy, CreatedDate, AlteredBy, AlteredDate } = req.body;
    const [updated] = await approvalMatrixTemp.update({ LinkID, DocumentTypeID, Version, SequenceLevel, AllorMajority, NumberofApprover, Active, CreatedBy, CreatedDate, AlteredBy, AlteredDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await approvalMatrixTemp.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "approvalMatrixTemp not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await approvalMatrixTemp.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "approvalMatrixTemp deleted" });
    else res.status(404).json({ message: "approvalMatrixTemp not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};