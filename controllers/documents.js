const { documents } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, DataImage, DataName, DataType, FileName, FileDate, Text1, Date1, Text2, Date2, Text3, Date3, Text4, Date4, Text5, Date5, Text6, Date6, Text7, Date7, Text8, Date8, Text9, Date9, Text10, Date10, Expiration, ExpirationDate, Confidential, PageCount, Remarks, Active, CreatedBy, CreatedDate } = req.body;
    const item = await documents.create({ LinkID, DataImage, DataName, DataType, FileName, FileDate, Text1, Date1, Text2, Date2, Text3, Date3, Text4, Date4, Text5, Date5, Text6, Date6, Text7, Date7, Text8, Date8, Text9, Date9, Text10, Date10, Expiration, ExpirationDate, Confidential, PageCount, Remarks, Active, CreatedBy, CreatedDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await documents.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await documents.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "documents not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, DataImage, DataName, DataType, FileName, FileDate, Text1, Date1, Text2, Date2, Text3, Date3, Text4, Date4, Text5, Date5, Text6, Date6, Text7, Date7, Text8, Date8, Text9, Date9, Text10, Date10, Expiration, ExpirationDate, Confidential, PageCount, Remarks, Active, CreatedBy, CreatedDate } = req.body;
    const [updated] = await documents.update({ LinkID, DataImage, DataName, DataType, FileName, FileDate, Text1, Date1, Text2, Date2, Text3, Date3, Text4, Date4, Text5, Date5, Text6, Date6, Text7, Date7, Text8, Date8, Text9, Date9, Text10, Date10, Expiration, ExpirationDate, Confidential, PageCount, Remarks, Active, CreatedBy, CreatedDate }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await documents.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "documents not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await documents.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "documents deleted" });
    else res.status(404).json({ message: "documents not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};