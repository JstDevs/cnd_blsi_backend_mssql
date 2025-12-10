const { propertyImproved } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { OwnerID, AreaSize, Unit, LandPIN, PIN, AddressID, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No } = req.body;
    const item = await propertyImproved.create({ OwnerID, AreaSize, Unit, LandPIN, PIN, AddressID, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await propertyImproved.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await propertyImproved.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "propertyImproved not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { OwnerID, AreaSize, Unit, LandPIN, PIN, AddressID, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No } = req.body;
    const [updated] = await propertyImproved.update({ OwnerID, AreaSize, Unit, LandPIN, PIN, AddressID, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await propertyImproved.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "propertyImproved not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await propertyImproved.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "propertyImproved deleted" });
    else res.status(404).json({ message: "propertyImproved not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};