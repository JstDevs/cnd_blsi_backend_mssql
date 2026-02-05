const db = require('../config/database');
const watermarks = db.Watermarks;
const path = require('path');


exports.create = async (req, res) => {
  try {
    const { DocumentID, Confidential } = req.body;

    // Manual ID increment
    const maxItem = await watermarks.findOne({ order: [['ID', 'DESC']] });
    const nextID = (maxItem ? parseInt(maxItem.ID) : 0) + 1;

    const item = await watermarks.create({
      ID: nextID,
      DocumentID,
      Confidential
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Watermarks create error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

exports.getAll = async (req, res) => {
  try {
    const docTypes = await db.documentType.findAll({
      order: [['Name', 'ASC']],
    });

    const watermarkSettings = await watermarks.findAll();

    const results = docTypes.map(doc => {
      const setting = watermarkSettings.find(w => w.DocumentID == doc.ID);
      return {
        ID: setting ? setting.ID : `new-${doc.ID}`,
        DocumentID: doc.ID,
        Confidential: setting ? setting.Confidential : 0,
        DocumentType: { Name: doc.Name }
      };
    });

    res.json(results);
  } catch (err) {
    console.error('GET /watermarks - Error:', err);
    res.status(500).json({
      error: err.message,
      sql: err.parent ? err.parent.sql : null
    });
  }
};


exports.getById = async (req, res) => {
  try {
    const item = await watermarks.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "watermarks not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { DocumentID, Confidential } = req.body;
    const id = req.params.id;

    if (id.startsWith('new-')) {
      // Create new record
      const actualDocID = id.split('-')[1];
      const maxItem = await watermarks.findOne({ order: [['ID', 'DESC']] });
      const nextID = (maxItem ? parseInt(maxItem.ID) : 0) + 1;

      const item = await watermarks.create({
        ID: nextID,
        DocumentID: actualDocID,
        Confidential
      });
      return res.json(item);
    }

    const [updated] = await watermarks.update({ DocumentID, Confidential }, {
      where: { ID: id }
    });

    if (updated) {
      const updatedItem = await watermarks.findByPk(id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "watermarks not found" });
    }

  } catch (err) {
    console.error('Watermarks update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await watermarks.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "watermarks deleted" });
    else res.status(404).json({ message: "watermarks not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};