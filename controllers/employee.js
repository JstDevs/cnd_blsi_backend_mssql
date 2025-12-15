const { employee } = require('../config/database');
const {getAllWithAssociations}=require("../models/associatedDependency");
const db=require('../config/database')
// exports.create = async (req, res) => {
//   try {
//     const { Picture, Signature, ReferenceID, IDNumber, FirstName, MiddleName, LastName, NationalityID, Birthday, Gender, MobileNumber, EmailAddress, EmergencyPerson, EmergencyNumber, TIN, SSS, Pagibig, Philhealth, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, DateHired, EmploymentStatusID, EmploymentStatusDate, PositionID, DepartmentID, ReportingTo, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate } = req.body;
//     const item = await employee.create({ Picture, Signature, ReferenceID, IDNumber, FirstName, MiddleName, LastName, NationalityID, Birthday, Gender, MobileNumber, EmailAddress, EmergencyPerson, EmergencyNumber, TIN, SSS, Pagibig, Philhealth, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, DateHired, EmploymentStatusID, EmploymentStatusDate, PositionID, DepartmentID, ReportingTo, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate });
//     res.status(201).json(item);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.create = async (req, res) => {
  try {
     let {
      FirstName,
      LastName,
      MiddleName,
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
      Active,
    } = req.body;

    const item = await employee.create({
      FirstName,
      LastName,
      MiddleName,
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
      CreatedBy: req?.user?.id?req?.user?.id:1,
      CreatedDate: new Date(),
      ModifyBy: req?.user?.id?req?.user?.id:1,
      ModifyDate: new Date(),
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(db.employee, 1, { Active: true })
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await employee.findOne({ where: { id: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "employee not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let {
  Picture ,
  Signature ,
  ReferenceID ,
  IDNumber ,
  FirstName ,
  MiddleName ,
  LastName ,
  NationalityID ,
  Birthday ,
  Gender ,
  MobileNumber ,
  EmailAddress ,
  EmergencyPerson ,
  EmergencyNumber ,
  TIN ,
  SSS ,
  Pagibig ,
  Philhealth ,
  StreetAddress ,
  BarangayID ,
  MunicipalityID ,
  ProvinceID,
  RegionID ,
  ZIPCode ,
  DateHired ,
  EmploymentStatusID ,
  EmploymentStatusDate ,
  PositionID ,
  DepartmentID ,
  ReportingTo ,
  Active ,
  CreatedBy ,
  
  ModifyBy 
}= req.body;

    const [updated] = await employee.update(
      {
       Picture ,
  Signature ,
  ReferenceID ,
  IDNumber ,
  FirstName ,
  MiddleName ,
  LastName ,
  NationalityID ,
  Birthday ,
  Gender ,
  MobileNumber ,
  EmailAddress ,
  EmergencyPerson ,
  EmergencyNumber ,
  TIN ,
  SSS ,
  Pagibig ,
  Philhealth ,
  StreetAddress ,
  BarangayID ,
  MunicipalityID ,
  ProvinceID,
  RegionID ,
  ZIPCode ,
  DateHired ,
  EmploymentStatusID ,
  EmploymentStatusDate ,
  PositionID ,
  DepartmentID ,
  ReportingTo ,
  Active ,
  CreatedBy: req?.user?.id?req?.user?.id:1,
  
  ModifyBy: req?.user?.id?req?.user?.id:1
        
      },
      {
        where: { id: req.params.id, Active: true }
      }
    );

    if (updated) {
      const updatedItem = await employee.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "employee not found" });
    }
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const [updated] = await employee.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: new Date() },
      { where: { id: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "employee deactivated" });
    else res.status(404).json({ message: "employee not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};