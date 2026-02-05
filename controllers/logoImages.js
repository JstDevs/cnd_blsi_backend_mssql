const db = require('../config/database');
const logoimages = db.LogoImages;
const path = require('path');

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const relativePath = path.join(req.uploadPath, req.file.filename).replace(/\\/g, '/');
    res.json({ filePath: relativePath });
  } catch (err) {
    console.error('LogoImages upload error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

exports.create = async (req, res) => {
  try {
    const { ImageOne, ImageTwo, ImageThree, ImageFour, ImageFive, ImageSix, ImageSeven, ImageEight, ImageNine, ImageTen } = req.body;

    // Find max ID manually since IDENTITY is missing in the DB
    const maxItem = await logoimages.findOne({ order: [['ID', 'DESC']] });
    const nextID = (maxItem ? parseInt(maxItem.ID) : 0) + 1;

    const item = await logoimages.create({
      ID: nextID,
      ImageOne, ImageTwo, ImageThree, ImageFour, ImageFive,
      ImageSix, ImageSeven, ImageEight, ImageNine, ImageTen
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('LogoImages create error:', err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      sql: err.parent ? err.parent.sql : null
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const latest = await logoimages.findOne({
      order: [['ID', 'DESC']],
    });

    if (!latest) {
      return res.json({
        ID: null,
        ImageOne: '', ImageTwo: '', ImageThree: '', ImageFour: '', ImageFive: '',
        ImageSix: '', ImageSeven: '', ImageEight: '', ImageNine: '', ImageTen: ''
      });
    }

    const data = latest.toJSON();

    // Ensure all Image fields have full URLs if they exist
    const fields = ['ImageOne', 'ImageTwo', 'ImageThree', 'ImageFour', 'ImageFive', 'ImageSix', 'ImageSeven', 'ImageEight', 'ImageNine', 'ImageTen'];
    fields.forEach(field => {
      if (data[field] && !data[field].startsWith('http')) {
        // We don't necessarily need to add the full URL here if the frontend handles it, 
        // but for consistency with my previous adapter:
        // data[field] = `${process.env.BASE_URL_SERVER}/uploads/${data[field]}`;
        // Actually, looking at the frontend code, it resolves the URL itself.
        // So we keep it relative as stored in DB.
      }
    });

    res.json(data);
  } catch (err) {
    console.error('LogoImages getAll error:', err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      sql: err.parent ? err.parent.sql : null
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await logoimages.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "logo images not found" });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

exports.update = async (req, res) => {
  try {
    const { ImageOne, ImageTwo, ImageThree, ImageFour, ImageFive, ImageSix, ImageSeven, ImageEight, ImageNine, ImageTen } = req.body;

    const [updated] = await logoimages.update({
      ImageOne, ImageTwo, ImageThree, ImageFour, ImageFive,
      ImageSix, ImageSeven, ImageEight, ImageNine, ImageTen
    }, {
      where: { ID: req.params.id }
    });

    if (updated) {
      const updatedItem = await logoimages.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "logo images not found" });
    }
  } catch (err) {
    console.error('LogoImages update error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await logoimages.destroy({ where: { ID: req.params.id } });
    if (deleted) res.json({ message: "logo images deleted" });
    else res.status(404).json({ message: "logo images not found" });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};