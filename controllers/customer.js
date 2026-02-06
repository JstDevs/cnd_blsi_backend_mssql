const db = require('../config/database');
const { Customer } = db;
const customer = Customer;

exports.create = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, TIN, RDO, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, FirstName, MiddleName, LastName, CivilStatus, PlaceofBirth, Gender, Height, Weight, Birthdate, Citizenship, Occupation, ICRNumber, Type, PlaceofIncorporation, KindofOrganization, DateofRegistration } = req.body;
    // Default Active to true if not provided or null/undefined
    const activeValue = Active !== undefined && Active !== null ? Active : true;
    const item = await customer.create({
      Code,
      Name,
      PaymentTermsID,
      PaymentMethodID,
      TIN,
      RDO,
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
      Active: activeValue,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE'),
      FirstName,
      MiddleName,
      LastName,
      CivilStatus,
      PlaceofBirth,
      Gender,
      Height,
      Weight,
      Birthdate,
      Citizenship,
      Occupation,
      ICRNumber,
      Type,
      PlaceofIncorporation,
      KindofOrganization,
      DateofRegistration
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Customer create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await customer.findAll({ where: { Active: true } });
    res.json(items);
  } catch (err) {
    console.error('Customer getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await customer.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "customer not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Code, Name, PaymentTermsID, PaymentMethodID, TIN, RDO, TaxCodeID, TypeID, IndustryTypeID, ContactPerson, PhoneNumber, MobileNumber, EmailAddress, Website, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, FirstName, MiddleName, LastName, CivilStatus, PlaceofBirth, Gender, Height, Weight, Birthdate, Citizenship, Occupation, ICRNumber, Type, PlaceofIncorporation, KindofOrganization, DateofRegistration } = req.body;
    // Ensure Active is never null - default to true if not provided or null/undefined
    const activeValue = Active !== undefined && Active !== null ? Active : true;
    const [updated] = await customer.update({
      Code,
      Name,
      PaymentTermsID,
      PaymentMethodID,
      TIN,
      RDO,
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
      Active: activeValue,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE'),
      FirstName,
      MiddleName,
      LastName,
      CivilStatus,
      PlaceofBirth,
      Gender,
      Height,
      Weight,
      Birthdate,
      Citizenship,
      Occupation,
      ICRNumber,
      Type,
      PlaceofIncorporation,
      KindofOrganization,
      DateofRegistration
    }, {
      where: { ID: req.params.id, Active: true }
    });
    if (updated) {
      const updatedItem = await customer.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "customer not found" });
    }
  } catch (err) {
    console.error('Customer update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await customer.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "customer deactivated" });
    else res.status(404).json({ message: "customer not found" });
  } catch (err) {
    console.error('Customer delete error:', err);
    res.status(500).json({ error: err.message });
  }
};