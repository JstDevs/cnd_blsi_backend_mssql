const { vendor } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, DeliveryLeadTime, TIN, RDO, Vatable, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode } = req.body;
    const item = await vendor.create({ Code, Name, PaymentTermsID, PaymentMethodID, DeliveryLeadTime, TIN, RDO, Vatable, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active: true, CreatedBy: req.user.id, CreatedDate: new Date(), ModifyBy: req.user.id, ModifyDate: new Date() });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await vendor.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await vendor.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "vendor not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, DeliveryLeadTime, TIN, RDO, Vatable, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode  } = req.body;
    const [updated] = await vendor.update({ Code, Name, PaymentTermsID, PaymentMethodID, DeliveryLeadTime, TIN, RDO, Vatable, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, ModifyBy: req.user.id, ModifyDate: new Date() }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await vendor.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "vendor not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await vendor.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "vendor deleted" });
    else res.status(404).json({ message: "vendor not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};