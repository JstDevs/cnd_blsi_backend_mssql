const { property } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { OwnerID, AreaSize, Unit, PIN, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No } = req.body;
    const item = await property.create({ OwnerID, AreaSize, Unit, PIN, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await property.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await property.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "property not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { OwnerID, AreaSize, Unit, PIN, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No } = req.body;
    const [updated] = await property.update({ OwnerID, AreaSize, Unit, PIN, Block, Lot, Street, BarangayID, MunicipalityID, RegionID, ZipCode, C, Type, Name, Classification, SubClassification, Preparedby, CreatedDate, OCT_TCT_CLOA_NO, CoOwnerID, BeneficialUserID, AdministratorID, AdvancePayment, AdvanceYear, T_D_No }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await property.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "property not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await property.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "property deleted" });
    else res.status(404).json({ message: "property not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};