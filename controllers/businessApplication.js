
const { BusinessApplication, BusinessActivity, Attachment, sequelize } = require('../config/database');
// const BusinessApplication=businessApplication
exports.createold = async (req, res) => {
  try {
    const { LinkID, ApplicantType, ModeofPayment, ApplicationDate, DTI_SEC_CDA_Registration, DTI_SEC_CDA_Registration_Date, BusinessType, Amendmentfrom, Amendmentto, TaxIncentives, CustomerID, BusinessName, Trade_Name_Franchise, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, TelephoneNumber, MobileNumber, EmailAddress, BusinessArea, TotalEmployee, LessorFullName, MonthlyRental, BusinessActivityID, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, LessorAddress, LessorNumber, LessorEmail, Rental, ContactPerson, ContactNumber, ContactEmail, ResidingLGU } = req.body;
    const item = await businessApplication.create({ LinkID, ApplicantType, ModeofPayment, ApplicationDate, DTI_SEC_CDA_Registration, DTI_SEC_CDA_Registration_Date, BusinessType, Amendmentfrom, Amendmentto, TaxIncentives, CustomerID, BusinessName, Trade_Name_Franchise, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, TelephoneNumber, MobileNumber, EmailAddress, BusinessArea, TotalEmployee, LessorFullName, MonthlyRental, BusinessActivityID, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, LessorAddress, LessorNumber, LessorEmail, Rental, ContactPerson, ContactNumber, ContactEmail, ResidingLGU });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await BusinessApplication.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await businessApplication.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "businessApplication not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, ApplicantType, ModeofPayment, ApplicationDate, DTI_SEC_CDA_Registration, DTI_SEC_CDA_Registration_Date, BusinessType, Amendmentfrom, Amendmentto, TaxIncentives, CustomerID, BusinessName, Trade_Name_Franchise, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, TelephoneNumber, MobileNumber, EmailAddress, BusinessArea, TotalEmployee, LessorFullName, MonthlyRental, BusinessActivityID, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, LessorAddress, LessorNumber, LessorEmail, Rental, ContactPerson, ContactNumber, ContactEmail, ResidingLGU } = req.body;
    const [updated] = await businessApplication.update({ LinkID, ApplicantType, ModeofPayment, ApplicationDate, DTI_SEC_CDA_Registration, DTI_SEC_CDA_Registration_Date, BusinessType, Amendmentfrom, Amendmentto, TaxIncentives, CustomerID, BusinessName, Trade_Name_Franchise, StreetAddress, BarangayID, MunicipalityID, ProvinceID, RegionID, ZIPCode, TelephoneNumber, MobileNumber, EmailAddress, BusinessArea, TotalEmployee, LessorFullName, MonthlyRental, BusinessActivityID, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, LessorAddress, LessorNumber, LessorEmail, Rental, ContactPerson, ContactNumber, ContactEmail, ResidingLGU }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await businessApplication.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "businessApplication not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await businessApplication.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "businessApplication deleted" });
    else res.status(404).json({ message: "businessApplication not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      IsNew,
      LinkID,
      ApplicantType,
      ModeOfPayment,
      DTI_SEC_CDA_Registration_Date,
      ApplicationDate,
      RegistrationNumber,
      RegistrationDate,
      BusinessType,
      AmendmentFrom,
      AmendmentTo,
      TaxIncentives,
      CustomerID,
      BusinessName,
      TradeName,
      StreetAddress,
      BarangayID,
      MunicipalityID,
      ProvinceID,
      RegionID,
      ZIPCode,
      TelephoneNumber,
      MobileNumber,
      EmailAddress,
      BusinessArea,
      TotalEmployee,
      LessorFullName,
      MonthlyRental,
      CreatedBy,
      LessorAddress,
      LessorNumber,
      LessorEmail,
      ResidingLGU,
      ContactPerson,
      ContactNumber,
      ContactEmail,
      Activities,
      Attachments
    } = req.body;

    const newLinkID = IsNew ? Date.now().toString() : LinkID;

    if (IsNew) {
      await BusinessApplication.create({
        LinkID: newLinkID,
        DTI_SEC_CDA_Registration_Date,
        ApplicantType,
        ModeOfPayment,
        ApplicationDate,
        DTI_SEC_CDA_Registration: RegistrationNumber || ' ',
        DTI_SEC_CDA_RegistrationDate: RegistrationDate,
        BusinessType,
        AmendmentFrom,
        AmendmentTo,
        TaxIncentives,
        CustomerID,
        BusinessName: BusinessName || ' ',
        TradeName_Franchise: TradeName || ' ',
        StreetAddress: StreetAddress || ' ',
        BarangayID,
        MunicipalityID,
        ProvinceID,
        RegionID,
        ZIPCode: ZIPCode || ' ',
        TelephoneNumber: TelephoneNumber || ' ',
        MobileNumber: MobileNumber || ' ',
        EmailAddress: EmailAddress || ' ',
        BusinessArea: BusinessArea || ' ',
        TotalEmployee: TotalEmployee || ' ',
        LessorFullName: LessorFullName || ' ',
        MonthlyRental: parseFloat(MonthlyRental) || 0,
        Active: true,
        CreatedBy,
        CreatedDate: new Date(),
        LessorAddress: LessorAddress || ' ',
        LessorNumber: LessorNumber || ' ',
        LessorEmail: LessorEmail || ' ',
        ResidingLGU: ResidingLGU || ' ',
        ContactPerson: ContactPerson || ' ',
        ContactNumber: ContactNumber || ' ',
        ContactEmail: ContactEmail || ' '
      }, { transaction: t });
    } else {
      await BusinessApplication.update({
        ApplicantType,
        ModeOfPayment,
        ApplicationDate,
        DTI_SEC_CDA_Registration: RegistrationNumber,
        DTI_SEC_CDA_RegistrationDate: DTI_SEC_CDA_Registration_Date,
        BusinessType,
        AmendmentFrom,
        AmendmentTo,
        TaxIncentives,
        CustomerID,
        BusinessName,
        TradeName_Franchise: TradeName,
        StreetAddress,
        BarangayID,
        MunicipalityID,
        ProvinceID,
        RegionID,
        ZIPCode,
        TelephoneNumber,
        MobileNumber,
        EmailAddress,
        BusinessArea,
        TotalEmployee,
        LessorFullName,
        MonthlyRental,
        Active: true,
        CreatedBy,
        CreatedDate: new Date(),
        LessorAddress,
        LessorNumber,
        LessorEmail,
        ResidingLGU,
        ContactPerson,
        ContactNumber,
        ContactEmail
      }, {
        where: { LinkID },
        transaction: t
      });
    }

    // Business Activities
    await BusinessActivity.destroy({ where: { LinkID: newLinkID }, transaction: t });
    for (const act of Activities || []) {
      await BusinessActivity.create({
        LinkID: newLinkID,
        LineOfBusiness: act.LineOfBusiness,
        NoUnits: act.NoUnits,
        Capitalization: act.Capitalization,
        GrossSales: act.GrossSales
      }, { transaction: t });
    }

    // Attachments
    await Attachment.destroy({ where: { LinkID: newLinkID }, transaction: t });
    for (const att of Attachments || []) {
      await Attachment.create({
        LinkID: newLinkID,
        DataImage: Buffer.from(att.DataImage, 'base64'),
        DataName: att.DataName,
        DataType: att.DataType
      }, { transaction: t });
    }

    await t.commit();
    res.json({ success: true, message: 'Business application saved successfully.', LinkID: newLinkID });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};
