const db = require('../config/database');
const lgu = db.Lgu;
const path = require('path');


exports.create = async (req, res) => {
  try {
    const { Code, Name, TIN, RDO, PhoneNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = req.body;

    // Sanitize dates - if empty string or invalid, use null or server date
    const sanitizedCreatedDate = CreatedDate && CreatedDate !== '' ? new Date(CreatedDate) : db.sequelize.fn('GETDATE');
    const sanitizedModifyDate = ModifyDate && ModifyDate !== '' ? new Date(ModifyDate) : null;

    const item = await lgu.create({
      Logo: null, Code, Name, TIN, RDO, PhoneNumber, EmailAddress, Website, StreetAddress,
      BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active,
      CreatedBy, CreatedDate: sanitizedCreatedDate,
      ModifyBy, ModifyDate: sanitizedModifyDate
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('LGU create error:', err);
    res.status(500).json({ error: err.message });
  }
};

// exports.getAll = async (req, res) => {
//   try {
//     const items = await lgu.findAll();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getAll = async (req, res) => {
  try {
    const latest = await lgu.findOne({
      order: [['ID', 'DESC']],
    });

    if (!latest) return res.json({}); // Return empty object instead of 404

    // Convert Sequelize instance to plain object
    const data = latest.toJSON();

    // Append full URL to logo if it exists
    if (data.Logo) {
      // Use process.env.BASE_URL_SERVER which is for the backend
      data.Logo = `${process.env.BASE_URL_SERVER}/uploads/${data.Logo}`;
    }

    res.json(data);
  } catch (err) {
    console.error('LGU getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const item = await lgu.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "lgu not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let logoPath = null;
    if (req.file) {
      logoPath = req.file.filename; // Just the filename, consistent with how it's stored
    }
    const { Code, Name, TIN, RDO, PhoneNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode } = req.body;

    // Check if record exists
    let item = await lgu.findByPk(req.params.id);

    if (!item) {
      // If table is empty, create the first record
      const count = await lgu.count();
      if (count === 0) {
        item = await lgu.create({
          Logo: logoPath, Code, Name, TIN, RDO, PhoneNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode,
          CreatedBy: req.user ? req.user.id : '1',
          CreatedDate: db.sequelize.fn('GETDATE'),
          Active: 1
        });

        // Append full URL for response object
        const result = item.toJSON();
        if (result.Logo) {
          result.Logo = `${process.env.BASE_URL_SERVER}/uploads/${result.Logo}`;
        }
        return res.json(result);
      } else {
        return res.status(404).json({ message: "lgu not found" });
      }
    }

    // Update existing record
    const updateData = {
      Code, Name, TIN, RDO, PhoneNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode,
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    };
    if (logoPath) updateData.Logo = logoPath;

    await item.update(updateData);

    const updatedItem = await lgu.findByPk(req.params.id);
    const result = updatedItem.toJSON();
    if (result.Logo) {
      result.Logo = `${process.env.BASE_URL_SERVER}/uploads/${result.Logo}`;
    }
    res.json(result);

  } catch (err) {
    console.error('LGU update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await lgu.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "lgu deleted" });
    else res.status(404).json({ message: "lgu not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};