const db = require('../config/database');
const employee = db.employee;
const { getAllWithAssociations } = require("../models/associatedDependency");

exports.create = async (req, res) => {
  try {
    let {
      FirstName,
      LastName,
      MiddleName,
      IDNumber,
      Birthday,
      Gender,
      StreetAddress,
      MobileNumber,
      EmailAddress,
      DepartmentID,
      PositionID,
      NationalityID,
      EmploymentStatusID,
      DateHired,
      TIN,
      SSS,
      Philhealth,
      Pagibig,
      Active, // This might be passed as false/null, default to true if needed
    } = req.body;

    // Default Active to true if not provided or null
    if (Active === undefined || Active === null) {
      Active = true;
    }

    const item = await employee.create({
      FirstName,
      LastName,
      MiddleName,
      IDNumber,
      NationalityID,
      Birthday,
      Gender,
      StreetAddress,
      MobileNumber,
      EmailAddress,
      DepartmentID,
      PositionID,
      EmploymentStatusID,
      DateHired,
      TIN,
      SSS,
      Philhealth,
      Pagibig,
      Active,
      CreatedBy: req.user ? req.user.id : '1',
      CreatedDate: db.sequelize.fn('GETDATE'),
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE'),
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(employee, 1, { Active: true })
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    // Note: Model uses ID (uppercase)
    const item = await employee.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "employee not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let {
      Picture,
      Signature,
      ReferenceID,
      IDNumber,
      FirstName,
      MiddleName,
      LastName,
      NationalityID,
      Birthday,
      Gender,
      MobileNumber,
      EmailAddress,
      EmergencyPerson,
      EmergencyNumber,
      TIN,
      SSS,
      Pagibig,
      Philhealth,
      StreetAddress,
      BarangayID,
      MunicipalityID,
      ProvinceID,
      RegionID,
      ZIPCode,
      DateHired,
      EmploymentStatusID,
      EmploymentStatusDate,
      PositionID,
      DepartmentID,
      ReportingTo,
      Active,
      ModifyBy
    } = req.body;

    // Helper: Convert empty strings/undefined to null
    const toNull = (val) => (val === '' || val === undefined || val === 'null') ? null : val;
    // Helper: Convert to Number or null
    const toNumber = (val) => {
      const v = toNull(val);
      return v ? Number(v) : null;
    };

    // Helper: Active to 1 (true) or 0 (false) for BIGINT compatibility
    const toActiveInt = (val) => (val === true || val === 'true' || val === 1 || val === '1') ? 1 : 0;

    // Construct update object safely
    const updateData = {
      ReferenceID: toNumber(ReferenceID),
      IDNumber,
      FirstName,
      MiddleName,
      LastName,
      NationalityID: toNumber(NationalityID),
      Birthday: toNull(Birthday),
      Gender,
      MobileNumber,
      EmailAddress,
      EmergencyPerson,
      EmergencyNumber,
      TIN,
      SSS,
      Pagibig,
      Philhealth,
      StreetAddress,
      BarangayID: toNumber(BarangayID),
      MunicipalityID: toNull(MunicipalityID), // Strings in model
      ProvinceID: toNull(ProvinceID), // Strings in model
      RegionID: toNull(RegionID), // Strings in model
      ZIPCode,
      DateHired: toNull(DateHired),
      EmploymentStatusID: toNumber(EmploymentStatusID),
      EmploymentStatusDate: toNull(EmploymentStatusDate),
      PositionID: toNumber(PositionID),
      DepartmentID: toNumber(DepartmentID),
      ReportingTo: toNumber(ReportingTo),
      Active: toActiveInt(Active),
      ModifyBy: req.user ? req.user.id : '1',
      ModifyDate: db.sequelize.fn('GETDATE')
    };

    // ONLY include Picture and Signature if they are NOT null (to avoid VarBinary conversion or overwriting with null)
    // If user explicitly wants to clear them, we might need a separate flag, but usually null means "no change" in multipart forms
    const cleanPicture = toNull(Picture);
    const cleanSignature = toNull(Signature);

    if (cleanPicture) {
      updateData.Picture = cleanPicture;
    }
    if (cleanSignature) {
      updateData.Signature = cleanSignature;
    }

    const [updated] = await employee.update(updateData, {
      where: { ID: req.params.id }
    });

    if (updated > 0) {
      const updatedItem = await employee.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      // If 0 updated, check existence
      const existing = await employee.findByPk(req.params.id);
      if (existing) {
        // It existed but no changes were detected/needed
        res.json(existing);
      } else {
        res.status(404).json({ message: "employee not found" });
      }
    }
  } catch (err) {
    console.error("Error updating employee:", err);
    // Explicitly returning detail for debugging
    res.status(500).json({
      error: err.message,
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};


exports.delete = async (req, res) => {
  try {
    const [updated] = await employee.update(
      {
        Active: false,
        ModifyBy: req.user ? req.user.id : '1',
        ModifyDate: db.sequelize.fn('GETDATE')
      },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "employee deactivated" });
    else res.status(404).json({ message: "employee not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};