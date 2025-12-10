const { Customer } = require('../config/database');
const customer = Customer;

exports.create = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, TIN, RDO, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, FirstName, MiddleName, LastName, CivilStatus, PlaceofBirth, Gender, Height, Weight, Birthdate, Citizenship, Occupation, ICRNumber, Type, PlaceofIncorporation, KindofOrganization, DateofRegistration } = req.body;
    const item = await customer.create({ Code, Name, PaymentTermsID, PaymentMethodID, TIN, RDO, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, FirstName, MiddleName, LastName, CivilStatus, PlaceofBirth, Gender, Height, Weight, Birthdate, Citizenship, Occupation, ICRNumber, Type, PlaceofIncorporation, KindofOrganization, DateofRegistration });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await customer.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await customer.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "customer not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, TIN, RDO, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, FirstName, MiddleName, LastName, CivilStatus, PlaceofBirth, Gender, Height, Weight, Birthdate, Citizenship, Occupation, ICRNumber, Type, PlaceofIncorporation, KindofOrganization, DateofRegistration } = req.body;
    const [updated] = await customer.update({ Code, Name, PaymentTermsID, PaymentMethodID, TIN, RDO, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, FirstName, MiddleName, LastName, CivilStatus, PlaceofBirth, Gender, Height, Weight, Birthdate, Citizenship, Occupation, ICRNumber, Type, PlaceofIncorporation, KindofOrganization, DateofRegistration }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await customer.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "customer not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await customer.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "customer deleted" });
    else res.status(404).json({ message: "customer not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};