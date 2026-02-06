const db = require('../config/database');
const { vendor } = db;

exports.create = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, DeliveryLeadTime, TIN, RDO, Vatable, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode } = req.body;
    const item = await vendor.create({
      Code,
      Name,
      PaymentTermsID,
      PaymentMethodID,
      DeliveryLeadTime,
      TIN,
      RDO,
      Vatable,
      TaxCodeID,
      TypeID,
      IndustryTypeID,
      ContactPerson,
      PhoneNumber,
      MobileNumber,
      EmailAddress,
      Website,
      StreetAddress,
      BarangayID,
      MunicipalityID,
      ProvinceID,
      RegionID,
      ZIPCode,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Vendor create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await vendor.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    console.error('Vendor getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await vendor.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "vendor not found" });
  } catch (err) {
    console.error('Vendor getById error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, DeliveryLeadTime, TIN, RDO, Vatable, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode } = req.body;
    const [updated] = await vendor.update({
      Code,
      Name,
      PaymentTermsID,
      PaymentMethodID,
      DeliveryLeadTime,
      TIN,
      RDO,
      Vatable,
      TaxCodeID,
      TypeID,
      IndustryTypeID,
      ContactPerson,
      PhoneNumber,
      MobileNumber,
      EmailAddress,
      Website,
      StreetAddress,
      BarangayID,
      MunicipalityID,
      ProvinceID,
      RegionID,
      ZIPCode,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await vendor.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "vendor not found" });
    }
  } catch (err) {
    console.error('Vendor update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await vendor.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "vendor deactivated" });
    else res.status(404).json({ message: "vendor not found" });
  } catch (err) {
    console.error('Vendor delete error:', err);
    res.status(500).json({ error: err.message });
  }
};