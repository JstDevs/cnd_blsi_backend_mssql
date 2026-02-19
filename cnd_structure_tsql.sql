-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: blsi-ph.com    Database: cnd
------------------------------------------------------
-- Server version	10.6.24-MariaDB-cll-lve

-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed

--
-- Table structure for table [Positions]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [Positions] (
  [ID] INT NOT NULL IDENTITY(1,1),
  [Title] varchar(100) NOT NULL,
  [Description] varchar(255) DEFAULT NULL,
  [Active] tinyINT NOT NULL DEFAULT 1,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT GETDATE(),
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [accountcategory]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [accountcategory] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [AccountSubTypeID] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [accountsubtype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [accountsubtype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [AccountTypeID] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Account SubType] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [accounttype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [accounttype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Account Type] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [apar]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [apar] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] varchar(50) DEFAULT NULL,
  [APAR] varchar(50) DEFAULT NULL,
  [RequestedBy] bigINT DEFAULT NULL,
  [RequestedDate] date DEFAULT NULL,
  [BudgetID] bigINT DEFAULT NULL,
  [VendorID] bigINT DEFAULT NULL,
  [CustomerID] bigINT DEFAULT NULL,
  [ReferenceNumber] varchar(50) DEFAULT NULL,
  [PONumber] varchar(50) DEFAULT NULL,
  [DRNumber] varchar(50) DEFAULT NULL,
  [BillingDate] datetime DEFAULT NULL,
  [BillingDueDate] date DEFAULT NULL,
  [Total] decimal(18,2) DEFAULT NULL,
  [Remarks] NVARCHAR(MAX) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [PaymentMethodID] bigINT DEFAULT NULL,
  [PaymentTermsID] bigINT DEFAULT NULL,
  [BillingNumber] bigINT DEFAULT NULL,
  [Status] varchar(50) DEFAULT NULL,
  [DocumentTypeID] bigINT DEFAULT NULL,
  [uniqueID] varchar(50) DEFAULT NULL,
  [InvoiceDate] date DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [approvalaudit]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [approvalaudit] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [InvoiceLink] bigINT DEFAULT NULL,
  [PositionorEmployee] varchar(50) DEFAULT NULL,
  [PositionorEmployeeID] bigINT DEFAULT NULL,
  [SequenceOrder] INT DEFAULT NULL,
  [ApprovalOrder] INT DEFAULT NULL,
  [ApprovalDate] date DEFAULT NULL,
  [RejectionDate] date DEFAULT NULL,
  [Remarks] varchar(250) DEFAULT NULL,
  [CreatedBy] varchar(250) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ApprovalVersion] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [approvalmatrix]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [approvalmatrix] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [DocumentTypeID] bigINT DEFAULT NULL,
  [Version] INT DEFAULT NULL,
  [SequenceLevel] varchar(50) DEFAULT NULL,
  [AllorMajority] varchar(150) DEFAULT NULL,
  [NumberofApprover] INT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(250) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [AlteredBy] varchar(250) DEFAULT NULL,
  [AlteredDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [approvalmatrixtemp]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [approvalmatrixtemp] (
  [ID] bigINT NOT NULL,
  [LinkID] bigINT DEFAULT NULL,
  [DocumentTypeID] bigINT DEFAULT NULL,
  [Version] INT DEFAULT NULL,
  [SequenceLevel] varchar(50) DEFAULT NULL,
  [AllorMajority] varchar(150) DEFAULT NULL,
  [NumberofApprover] INT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(250) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [AlteredBy] varchar(250) DEFAULT NULL,
  [AlteredDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [approvers]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [approvers] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [ApprovalVersion] INT DEFAULT NULL,
  [PositionorEmployee] varchar(50) DEFAULT NULL,
  [PositionorEmployeeID] bigINT DEFAULT NULL,
  [AmountFrom] decimal(18,2) DEFAULT NULL,
  [AmountTo] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [approverstemp]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [approverstemp] (
  [ID] bigINT NOT NULL,
  [LinkID] bigINT DEFAULT NULL,
  [PositionorEmployee] varchar(50) DEFAULT NULL,
  [PositionorEmployeeID] bigINT DEFAULT NULL,
  [AmountFrom] decimal(18,2) DEFAULT NULL,
  [AmountTo] decimal(18,2) DEFAULT NULL,
  [ApprovalVersion] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [assessmentlevel]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [assessmentlevel] (
  [ID] bigINT NOT NULL,
  [ClassificationID] bigINT DEFAULT NULL,
  [From] decimal(18,2) DEFAULT NULL,
  [To] decimal(18,2) DEFAULT NULL,
  [AssessmentLevel] INT DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  [Ative] tinyINT DEFAULT NULL,
  [UsingStatus] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [assignsubdepartment]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [assignsubdepartment] (
  [id] INT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [DepartmentID] bigINT DEFAULT NULL,
  [SubdepartmentID] bigINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([id])
);
-- MySQL Header Removed

--
-- Table structure for table [attachment]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [attachment] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [DataImage] varchar(500) DEFAULT NULL,
  [DataName] varchar(250) DEFAULT NULL,
  [DataType] varchar(1000) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [attachment_temp]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [attachment_temp] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [DataImage] VARBINARY(MAX) DEFAULT NULL,
  [DataName] varchar(250) DEFAULT NULL,
  [DataType] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [audittrail]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [audittrail] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Module] varchar(150) DEFAULT NULL,
  [Action] varchar(50) DEFAULT NULL,
  [Script] NVARCHAR(MAX) DEFAULT NULL,
  [ParamValues] NVARCHAR(MAX) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Audit Trail] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [bank]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [bank] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [BranchCode] varchar(50) DEFAULT NULL,
  [Branch] varchar(150) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Address] varchar(500) DEFAULT NULL,
  [AccountNumber] varchar(150) DEFAULT NULL,
  [IBAN] varchar(150) DEFAULT NULL,
  [SwiftCode] varchar(150) DEFAULT NULL,
  [Balance] decimal(18,2) DEFAULT NULL,
  [CurrencyID] bigINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Bank] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [barangay]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [barangay] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [BarangayCode] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [RegionCode] varchar(50) DEFAULT NULL,
  [ProvinceCode] varchar(50) DEFAULT NULL,
  [MunicipalityCode] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [PIN] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Barangay] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [beginningbalance]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [beginningbalance] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [FiscalYearID] bigINT DEFAULT NULL,
  [FundsID] bigINT DEFAULT NULL,
  [ChartofAccountsCode] varchar(50) DEFAULT NULL,
  [BeginningBalance] decimal(18,2) DEFAULT NULL,
  [TransactionType] varchar(50) DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [budget]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [budget] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [FiscalYearID] bigINT DEFAULT NULL,
  [FundID] bigINT DEFAULT NULL,
  [ProjectID] bigINT DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [DepartmentID] INT DEFAULT NULL,
  [SubDepartmentID] bigINT DEFAULT NULL,
  [ChartofAccountsID] bigINT DEFAULT NULL,
  [Appropriation] decimal(18,2) DEFAULT NULL,
  [TotalAmount] decimal(18,2) DEFAULT NULL,
  [AppropriationBalance] decimal(18,2) DEFAULT NULL,
  [Change] decimal(18,2) DEFAULT NULL,
  [Supplemental] decimal(18,2) DEFAULT NULL,
  [Transfer] decimal(18,2) DEFAULT NULL,
  [Released] decimal(18,2) DEFAULT NULL,
  [AllotmentBalance] decimal(18,2) DEFAULT NULL,
  [ChargedAllotment] decimal(18,2) DEFAULT NULL,
  [PreEncumbrance] decimal(18,2) DEFAULT NULL,
  [Encumbrance] decimal(18,2) DEFAULT NULL,
  [Charges] decimal(18,2) DEFAULT NULL,
  [January] decimal(18,2) DEFAULT NULL,
  [February] decimal(18,2) DEFAULT NULL,
  [March] decimal(18,2) DEFAULT NULL,
  [April] decimal(18,2) DEFAULT NULL,
  [May] decimal(18,2) DEFAULT NULL,
  [June] decimal(18,2) DEFAULT NULL,
  [July] decimal(18,2) DEFAULT NULL,
  [August] decimal(18,2) DEFAULT NULL,
  [September] decimal(18,2) DEFAULT NULL,
  [October] decimal(18,2) DEFAULT NULL,
  [November] decimal(18,2) DEFAULT NULL,
  [December] decimal(18,2) DEFAULT NULL,
  [RevisedAmount] decimal(18,2) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime NOT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Budget] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [budgetchange]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [budgetchange] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [BudgetID] bigINT DEFAULT NULL,
  [BudgetTypeID] bigINT DEFAULT NULL,
  [BudgetFrom] bigINT DEFAULT NULL,
  [BudgetTo] bigINT DEFAULT NULL,
  [Amount] decimal(18,2) DEFAULT NULL,
  [Acive] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [Name] NVARCHAR(MAX) DEFAULT NULL,
  [January] decimal(18,2) DEFAULT NULL,
  [February] decimal(18,2) DEFAULT NULL,
  [March] decimal(18,2) DEFAULT NULL,
  [April] decimal(18,2) DEFAULT NULL,
  [May] decimal(18,2) DEFAULT NULL,
  [June] decimal(18,2) DEFAULT NULL,
  [July] decimal(18,2) DEFAULT NULL,
  [August] decimal(18,2) DEFAULT NULL,
  [September] decimal(18,2) DEFAULT NULL,
  [October] decimal(18,2) DEFAULT NULL,
  [November] decimal(18,2) DEFAULT NULL,
  [December] decimal(18,2) DEFAULT NULL,
  [FiscalYearID] bigINT DEFAULT NULL,
  [DepartmentID] bigINT DEFAULT NULL,
  [SubDepartmentID] bigINT DEFAULT NULL,
  [ChartofAccountsID] bigINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [TotalAmount] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [budgettype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [budgettype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Budget Type] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [buildingcomponents]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [buildingcomponents] (
  [ID] bigINT NOT NULL,
  [BuildingComponents] varchar(50) DEFAULT NULL,
  [PIN] bigINT DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [burialrecord]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [burialrecord] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [CustomerID] bigINT DEFAULT NULL,
  [DeceasedCustomerID] bigINT DEFAULT NULL,
  [CauseofDeath] varchar(50) DEFAULT NULL,
  [Nationality] varchar(50) DEFAULT NULL,
  [DeathDate] date DEFAULT NULL,
  [Cementery] varchar(50) DEFAULT NULL,
  [BurialType] varchar(50) DEFAULT NULL,
  [Infectious] tinyINT DEFAULT NULL,
  [Embalmed] tinyINT DEFAULT NULL,
  [Disposition] varchar(50) DEFAULT NULL,
  [Sex] varchar(50) DEFAULT NULL,
  [Age] INT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [business_permits]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [business_permits] (
  [id] INT NOT NULL IDENTITY(1,1),
  [applicantType] varchar(50) DEFAULT NULL,
  [modeOfPayment] varchar(50) DEFAULT NULL,
  [dateOfApplication] date DEFAULT NULL,
  [dtiSecCdaRegistrationNo] varchar(100) DEFAULT NULL,
  [dtiSecCdaRegistrationDate] date DEFAULT NULL,
  [tinNo] varchar(100) DEFAULT NULL,
  [typeOfBusiness] varchar(100) DEFAULT NULL,
  [amendmentFrom] varchar(100) DEFAULT NULL,
  [amendmentTo] varchar(100) DEFAULT NULL,
  [taxIncentiveFromGovEntity] varchar(10) DEFAULT 'no',
  [lastName] varchar(100) DEFAULT NULL,
  [firstName] varchar(100) DEFAULT NULL,
  [middleName] varchar(100) DEFAULT NULL,
  [businessName] varchar(255) DEFAULT NULL,
  [tradeNameFranchise] varchar(255) DEFAULT NULL,
  [businessRegion] varchar(100) DEFAULT NULL,
  [businessProvince] varchar(100) DEFAULT NULL,
  [businessMunicipality] varchar(100) DEFAULT NULL,
  [businessBarangay] varchar(100) DEFAULT NULL,
  [businessStreetAddress] varchar(255) DEFAULT NULL,
  [postalCode] varchar(20) DEFAULT NULL,
  [emailAddress] varchar(100) DEFAULT NULL,
  [telephoneNo] varchar(50) DEFAULT NULL,
  [mobileNo] varchar(50) DEFAULT NULL,
  [ownerStreetAddress] varchar(255) DEFAULT NULL,
  [ownerBarangay] varchar(100) DEFAULT NULL,
  [ownerMunicipality] varchar(100) DEFAULT NULL,
  [ownerRegion] varchar(100) DEFAULT NULL,
  [ownerPostalCode] varchar(20) DEFAULT NULL,
  [ownerEmailAddress] varchar(100) DEFAULT NULL,
  [ownerTelephoneNo] varchar(50) DEFAULT NULL,
  [ownerMobileNo] varchar(50) DEFAULT NULL,
  [emergencyContactPerson] varchar(100) DEFAULT NULL,
  [emergencyContactNumber] varchar(50) DEFAULT NULL,
  [emergencyContactEmail] varchar(100) DEFAULT NULL,
  [businessArea] float DEFAULT 0,
  [totalEmployees] INT DEFAULT 0,
  [employeesResidingWithLgli] INT DEFAULT 0,
  [lessorFullName] varchar(100) DEFAULT NULL,
  [lessorAddress] varchar(255) DEFAULT NULL,
  [lessorContactNumber] varchar(50) DEFAULT NULL,
  [lessorEmail] varchar(100) DEFAULT NULL,
  [monthlyRental] decimal(15,2) DEFAULT 0.00,
  [lineOfBusiness] varchar(255) DEFAULT NULL,
  [numberOfUnits] INT DEFAULT 0,
  [capitalization] decimal(15,2) DEFAULT 0.00,
  [grossSales] decimal(15,2) DEFAULT 0.00,
  [status] varchar(50) DEFAULT 'Pending',
  [createdAt] datetime NOT NULL,
  [updatedAt] datetime NOT NULL,
  PRIMARY KEY ([id])
);
-- MySQL Header Removed

--
-- Table structure for table [businessactivity]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [businessactivity] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [LineofBusiness] varchar(150) DEFAULT NULL,
  [NoUnits] varchar(50) DEFAULT NULL,
  [Capitalization] decimal(18,2) DEFAULT NULL,
  [GrossSales] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [businessapplication]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [businessapplication] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [ApplicantType] varchar(50) DEFAULT NULL,
  [ModeofPayment] varchar(150) DEFAULT NULL,
  [ApplicationDate] date DEFAULT NULL,
  [DTI_SEC_CDA_Registration] varchar(150) DEFAULT NULL,
  [DTI_SEC_CDA_Registration_Date] date DEFAULT NULL,
  [BusinessType] varchar(50) DEFAULT NULL,
  [Amendmentfrom] varchar(50) DEFAULT NULL,
  [Amendmentto] varchar(50) DEFAULT NULL,
  [TaxIncentives] varchar(150) DEFAULT NULL,
  [CustomerID] bigINT DEFAULT NULL,
  [BusinessName] varchar(250) DEFAULT NULL,
  [Trade_Name_Franchise] varchar(250) DEFAULT NULL,
  [StreetAddress] varchar(150) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] varchar(50) DEFAULT NULL,
  [ProvinceID] varchar(50) DEFAULT NULL,
  [RegionID] varchar(50) DEFAULT NULL,
  [ZIPCode] varchar(50) DEFAULT NULL,
  [TelephoneNumber] varchar(50) DEFAULT NULL,
  [MobileNumber] varchar(50) DEFAULT NULL,
  [EmailAddress] varchar(50) DEFAULT NULL,
  [BusinessArea] varchar(150) DEFAULT NULL,
  [TotalEmployee] varchar(150) DEFAULT NULL,
  [LessorFullName] varchar(250) DEFAULT NULL,
  [MonthlyRental] decimal(18,2) DEFAULT NULL,
  [BusinessActivityID] bigINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [LessorAddress] varchar(250) DEFAULT NULL,
  [LessorNumber] varchar(150) DEFAULT NULL,
  [LessorEmail] varchar(150) DEFAULT NULL,
  [Rental] decimal(18,2) DEFAULT NULL,
  [ContactPerson] varchar(150) DEFAULT NULL,
  [ContactNumber] varchar(150) DEFAULT NULL,
  [ContactEmail] varchar(150) DEFAULT NULL,
  [ResidingLGU] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [chartofaccounts]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [chartofaccounts] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [AccountCode] varchar(150) DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Description] NVARCHAR(MAX) DEFAULT NULL,
  [AccountTypeID] bigINT DEFAULT NULL,
  [AccountSubTypeID] bigINT DEFAULT NULL,
  [AccountCategoryID] bigINT DEFAULT NULL,
  [NormalBalance] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [SL] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [check]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [check] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Status] varchar(50) DEFAULT NULL,
  [LinkID] bigINT DEFAULT NULL,
  [DisbursementID] varchar(150) DEFAULT NULL,
  [BankID] bigINT DEFAULT NULL,
  [SignatoryType] varchar(50) DEFAULT NULL,
  [AccountNumber] bigINT DEFAULT NULL,
  [AccountName] varchar(350) DEFAULT NULL,
  [CheckNumber] varchar(50) DEFAULT NULL,
  [BRSTN] varchar(50) DEFAULT NULL,
  [CheckDate] date DEFAULT NULL,
  [Payee] varchar(350) DEFAULT NULL,
  [Amount] decimal(18,2) DEFAULT NULL,
  [Words] varchar(450) DEFAULT NULL,
  [SignatoryOneID] varchar(50) DEFAULT NULL,
  [SignatoryTwoID] varchar(50) DEFAULT NULL,
  [Remarks] varchar(450) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [ApprovalProgress] INT DEFAULT NULL,
  [ApprovalVersion] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [citizensregistration]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [citizensregistration] (
  [ID] bigINT NOT NULL,
  [Picture] VARBINARY(MAX) DEFAULT NULL,
  [Suffix] varchar(50) DEFAULT NULL,
  [FirstName] varchar(150) DEFAULT NULL,
  [MiddleName] varchar(150) DEFAULT NULL,
  [LastName] varchar(150) DEFAULT NULL,
  [BirthDate] date DEFAULT NULL,
  [MobileNumber] varchar(150) DEFAULT NULL,
  [EmailAddress] varchar(150) DEFAULT NULL,
  [MothersMaidenName] varchar(250) DEFAULT NULL,
  [CivilStatus] varchar(150) DEFAULT NULL,
  [ValidID] varchar(250) DEFAULT NULL,
  [IDNumber] varchar(150) DEFAULT NULL,
  [FrontID] VARBINARY(MAX) DEFAULT NULL,
  [BackID] VARBINARY(MAX) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [contraaccount]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [contraaccount] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [ContraAccountID] varchar(50) DEFAULT NULL,
  [NormalBalance] varchar(50) DEFAULT NULL,
  [Amount] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [currency]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [currency] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Currency] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [customer]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [customer] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [PaymentTermsID] bigINT DEFAULT NULL,
  [PaymentMethodID] bigINT DEFAULT NULL,
  [TIN] varchar(50) DEFAULT NULL,
  [RDO] varchar(50) DEFAULT NULL,
  [TaxCodeID] bigINT DEFAULT NULL,
  [TypeID] bigINT DEFAULT NULL,
  [IndustryTypeID] bigINT DEFAULT NULL,
  [ContactPerson] varchar(300) DEFAULT NULL,
  [PhoneNumber] varchar(150) DEFAULT NULL,
  [MobileNumber] varchar(150) DEFAULT NULL,
  [EmailAddress] varchar(150) DEFAULT NULL,
  [Website] varchar(250) DEFAULT NULL,
  [StreetAddress] varchar(500) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] varchar(50) DEFAULT NULL,
  [ProvinceID] varchar(50) DEFAULT NULL,
  [RegionID] varchar(50) DEFAULT NULL,
  [ZIPCode] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [FirstName] NVARCHAR(MAX) DEFAULT NULL,
  [MiddleName] NVARCHAR(MAX) DEFAULT NULL,
  [LastName] NVARCHAR(MAX) DEFAULT NULL,
  [CivilStatus] varchar(50) DEFAULT NULL,
  [PlaceofBirth] varchar(50) DEFAULT NULL,
  [Gender] varchar(50) DEFAULT NULL,
  [Height] decimal(18,2) DEFAULT NULL,
  [Weight] decimal(18,2) DEFAULT NULL,
  [Birthdate] date DEFAULT NULL,
  [Citizenship] varchar(50) DEFAULT NULL,
  [Occupation] varchar(50) DEFAULT NULL,
  [ICRNumber] bigINT DEFAULT NULL,
  [Type] varchar(50) DEFAULT NULL,
  [PlaceofIncorporation] varchar(350) DEFAULT NULL,
  [KindofOrganization] varchar(150) DEFAULT NULL,
  [DateofRegistration] date DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Customer] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [datasources]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [datasources] (
  [ID] INT NOT NULL,
  [DataSourceName] varchar(255)   DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [department]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [department] (
  [ID] INT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Department] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [documentaccess]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [documentaccess] (
  [id] INT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [UserID] bigINT DEFAULT NULL,
  [View] tinyINT DEFAULT NULL,
  [Add] tinyINT DEFAULT NULL,
  [Edit] tinyINT DEFAULT NULL,
  [Delete] tinyINT DEFAULT NULL,
  [Print] tinyINT DEFAULT NULL,
  [Confidential] tinyINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([id])
);
-- MySQL Header Removed

--
-- Table structure for table [documents]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [documents] (
  [ID] bigINT NOT NULL,
  [LinkID] bigINT DEFAULT NULL,
  [DataImage] VARBINARY(MAX) DEFAULT NULL,
  [DataName] varchar(250) DEFAULT NULL,
  [DataType] varchar(50) DEFAULT NULL,
  [FileName] varchar(250) DEFAULT NULL,
  [FileDate] date DEFAULT NULL,
  [Text1] varchar(250) DEFAULT NULL,
  [Date1] date DEFAULT NULL,
  [Text2] varchar(250) DEFAULT NULL,
  [Date2] date DEFAULT NULL,
  [Text3] varchar(250) DEFAULT NULL,
  [Date3] date DEFAULT NULL,
  [Text4] varchar(250) DEFAULT NULL,
  [Date4] date DEFAULT NULL,
  [Text5] varchar(250) DEFAULT NULL,
  [Date5] date DEFAULT NULL,
  [Text6] varchar(250) DEFAULT NULL,
  [Date6] date DEFAULT NULL,
  [Text7] varchar(250) DEFAULT NULL,
  [Date7] date DEFAULT NULL,
  [Text8] varchar(250) DEFAULT NULL,
  [Date8] date DEFAULT NULL,
  [Text9] varchar(250) DEFAULT NULL,
  [Date9] date DEFAULT NULL,
  [Text10] varchar(250) DEFAULT NULL,
  [Date10] date DEFAULT NULL,
  [Expiration] tinyINT DEFAULT NULL,
  [ExpirationDate] date DEFAULT NULL,
  [Confidential] tinyINT DEFAULT NULL,
  [PageCount] INT DEFAULT NULL,
  [Remarks] NVARCHAR(MAX) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [documenttype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [documenttype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [DocumentTypeCategoryID] bigINT DEFAULT NULL,
  [Prefix] varchar(50) DEFAULT NULL,
  [StartNumber] INT DEFAULT NULL,
  [CurrentNumber] INT DEFAULT NULL,
  [Suffix] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Document Type] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [documenttypecategory]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [documenttypecategory] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Document Type Category] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [employee]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [employee] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Picture] VARBINARY(MAX) DEFAULT NULL,
  [Signature] VARBINARY(MAX) DEFAULT NULL,
  [ReferenceID] bigINT DEFAULT NULL,
  [IDNumber] varchar(50) DEFAULT NULL,
  [FirstName] varchar(150) DEFAULT NULL,
  [MiddleName] varchar(150) DEFAULT NULL,
  [LastName] varchar(150) DEFAULT NULL,
  [NationalityID] INT DEFAULT NULL,
  [Birthday] date DEFAULT NULL,
  [Gender] varchar(150) DEFAULT NULL,
  [MobileNumber] varchar(150) DEFAULT NULL,
  [EmailAddress] varchar(150) DEFAULT NULL,
  [EmergencyPerson] varchar(250) DEFAULT NULL,
  [EmergencyNumber] varchar(150) DEFAULT NULL,
  [TIN] varchar(150) DEFAULT NULL,
  [SSS] varchar(150) DEFAULT NULL,
  [Pagibig] varchar(50) DEFAULT NULL,
  [Philhealth] varchar(50) DEFAULT NULL,
  [StreetAddress] varchar(500) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] varchar(50) DEFAULT NULL,
  [ProvinceID] varchar(50) DEFAULT NULL,
  [RegionID] varchar(50) DEFAULT NULL,
  [ZIPCode] varchar(50) DEFAULT NULL,
  [DateHired] date DEFAULT NULL,
  [EmploymentStatusID] INT DEFAULT NULL,
  [EmploymentStatusDate] date DEFAULT NULL,
  [PositionID] INT DEFAULT NULL,
  [DepartmentID] INT DEFAULT NULL,
  [ReportingTo] bigINT DEFAULT NULL,
  [Active] bigINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Employee] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [employmentstatus]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [employmentstatus] (
  [ID] INT NOT NULL IDENTITY(1,1),
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Employment Status] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [fields]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [fields] (
  [id] INT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [FieldNumber] smallINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [Description] varchar(150) DEFAULT NULL,
  [DataType] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([id])
);
-- MySQL Header Removed

--
-- Table structure for table [financialstatement]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [financialstatement] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Financial Statement] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [fiscalyear]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [fiscalyear] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Year] varchar(50) DEFAULT NULL,
  [MonthStart] varchar(50) DEFAULT NULL,
  [MonthEnd] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [AssessedValue] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Fiscal Year] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [funds]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [funds] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Description] NVARCHAR(MAX) DEFAULT NULL,
  [OriginalAmount] decimal(18,2) DEFAULT NULL,
  [Balance] decimal(18,2) DEFAULT NULL,
  [Total] decimal(18,2) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [generalledger]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [generalledger] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [FundID] bigINT DEFAULT NULL,
  [FundName] varchar(150) DEFAULT NULL,
  [LedgerItem] varchar(350) DEFAULT NULL,
  [AccountName] varchar(350) DEFAULT NULL,
  [AccountCode] varchar(250) DEFAULT NULL,
  [Debit] decimal(18,2) DEFAULT NULL,
  [Credit] decimal(18,2) DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [DocumentTypeName] varchar(150) DEFAULT NULL,
  [PostingPeriod] date DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [generalrevision]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [generalrevision] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [General_Revision_Date_Year] INT DEFAULT NULL,
  [GeneralRevisionCode] varchar(50) DEFAULT NULL,
  [TaxDeclarationCode] varchar(50) DEFAULT NULL,
  [CityorMunicipalityAssessor] varchar(50) DEFAULT NULL,
  [CityorMunicipalityAssistantAssessor] varchar(50) DEFAULT NULL,
  [ProvincialAssessor] varchar(50) DEFAULT NULL,
  [ProvincialAssistantAssessor] varchar(50) DEFAULT NULL,
  [Createdby] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [Modifiedby] varchar(50) DEFAULT NULL,
  [ModifiedDate] datetime DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [UsingStatus] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [homeowner]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [homeowner] (
  [ID] bigINT NOT NULL,
  [CustomerID] bigINT DEFAULT NULL,
  [PropertyCount] smallINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Home Owner] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [industrytype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [industrytype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(250) DEFAULT NULL,
  [Active] bigINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_IndustryType] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [item]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [item] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Category] varchar(150) DEFAULT NULL,
  [ChargeAccountID] bigINT DEFAULT NULL,
  [TAXCodeID] bigINT DEFAULT NULL,
  [UnitID] bigINT DEFAULT NULL,
  [EWT] decimal(18,2) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [PurchaseOrSales] varchar(50) DEFAULT NULL,
  [Vatable] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Item] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [itemunit]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [itemunit] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Item Unit] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [journalentryvoucher]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [journalentryvoucher] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [ResponsibilityCenter] varchar(250) DEFAULT NULL,
  [FundName] varchar(150) DEFAULT NULL,
  [LedgerItem] varchar(350) DEFAULT NULL,
  [AccountName] varchar(350) DEFAULT NULL,
  [AccountCode] varchar(250) DEFAULT NULL,
  [Debit] decimal(18,2) DEFAULT NULL,
  [Credit] decimal(18,2) DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [DocumentTypeName] varchar(150) DEFAULT NULL,
  [PR] varchar(150) DEFAULT NULL,
  [Particulars] varchar(200) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [lgu]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [lgu] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Logo] varchar(1000) DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [TIN] varchar(50) DEFAULT NULL,
  [RDO] varchar(50) DEFAULT NULL,
  [PhoneNumber] varchar(150) DEFAULT NULL,
  [EmailAddress] varchar(150) DEFAULT NULL,
  [Website] varchar(250) DEFAULT NULL,
  [StreetAddress] varchar(500) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] bigINT DEFAULT NULL,
  [ProvinceID] bigINT DEFAULT NULL,
  [RegionID] bigINT DEFAULT NULL,
  [ZIPCode] varchar(50) DEFAULT NULL,
  [Active] bigINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_LGU] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [logoimages]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [logoimages] (
  [ID] INT NOT NULL,
  [Image] varchar(255)   DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [marketvaluematrix]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [marketvaluematrix] (
  [ID] bigINT NOT NULL,
  [Classification] bigINT DEFAULT NULL,
  [UnitValue] decimal(18,2) DEFAULT NULL,
  [DateFrom] date DEFAULT NULL,
  [DateTo] date DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [marriagerecord]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [marriagerecord] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [CustomerID] bigINT DEFAULT NULL,
  [CustomerAge] INT DEFAULT NULL,
  [MarytoID] bigINT DEFAULT NULL,
  [MarrytoAge] INT DEFAULT NULL,
  [Cenomar] varchar(50) DEFAULT NULL,
  [RegisterNumber] varchar(50) DEFAULT NULL,
  [CreatedBy] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [ModifyBy] bigINT DEFAULT NULL,
  [ModifyDate] date DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [matrixclassification]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [matrixclassification] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(50) DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [UsingStatus] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [matrixlocation_description]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [matrixlocation_description] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LocationorDescription] varchar(50) DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [UsingStatus] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [module]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [module] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Description] varchar(150) DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Module] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [moduleaccess]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [moduleaccess] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [UserAccessID] bigINT DEFAULT NULL,
  [ModuleID] bigINT DEFAULT NULL,
  [View] tinyINT DEFAULT NULL,
  [Add] tinyINT DEFAULT NULL,
  [Edit] tinyINT DEFAULT NULL,
  [Delete] tinyINT DEFAULT NULL,
  [Print] tinyINT DEFAULT NULL,
  [Mayor] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Module Access] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [municipality]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [municipality] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [PSGCCode] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [RegionCode] varchar(50) DEFAULT NULL,
  [ProvinceCode] varchar(50) DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [PIN] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [nationality]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [nationality] (
  [ID] INT NOT NULL IDENTITY(1,1),
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Nationality] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [noticationtable]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [noticationtable] (
  [ID] bigINT NOT NULL,
  [AddressID] bigINT DEFAULT NULL,
  [Message] varchar(550) DEFAULT NULL,
  [OriginForm] varchar(250) DEFAULT NULL,
  [OriginID] bigINT DEFAULT NULL,
  [LinkID] bigINT DEFAULT NULL,
  [SentDate] datetime DEFAULT NULL,
  [ReceivedDate] datetime DEFAULT NULL,
  [Read] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [paymentmethod]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [paymentmethod] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Payment Method] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [paymentterms]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [paymentterms] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [NumberOfDays] INT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Payment Terms] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [position]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [position] (
  [ID] INT NOT NULL IDENTITY(1,1),
  [Name] varchar(150) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Position Level] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [ppe]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [ppe] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [CategoryID] bigINT DEFAULT NULL,
  [SupplierID] bigINT DEFAULT NULL,
  [PPENumber] varchar(50) DEFAULT NULL,
  [Unit] varchar(50) DEFAULT NULL,
  [Description] NVARCHAR(MAX) DEFAULT NULL,
  [Cost] decimal(10,2) DEFAULT NULL,
  [Barcode] varchar(50) DEFAULT NULL,
  [Quantity] INT DEFAULT NULL,
  [DateAcquired] datetime DEFAULT NULL,
  [EstimatedUsefulLife] INT DEFAULT NULL,
  [DepreciationRate] decimal(10,2) DEFAULT NULL,
  [DepreciationValue] decimal(10,2) DEFAULT NULL,
  [NetBookValue] decimal(10,2) DEFAULT NULL,
  [PONumber] varchar(50) DEFAULT NULL,
  [PRNumber] varchar(50) DEFAULT NULL,
  [InvoiceNumber] varchar(50) DEFAULT NULL,
  [AIRNumber] varchar(50) DEFAULT NULL,
  [RISNumber] varchar(50) DEFAULT NULL,
  [Remarks] NVARCHAR(MAX) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [ModifiedBy] varchar(100) DEFAULT NULL,
  [ModifiedDate] datetime DEFAULT NULL,
  [CreatedBy] varchar(100) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [ppecategory]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [ppecategory] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(100) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifiedBy] varchar(50) DEFAULT NULL,
  [ModifiedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [ppesupplier]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [ppesupplier] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(100) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifiedBy] varchar(50) DEFAULT NULL,
  [ModifiedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [project]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [project] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Title] NVARCHAR(MAX) DEFAULT NULL,
  [ProjectTypeID] bigINT DEFAULT NULL,
  [Description] NVARCHAR(MAX) DEFAULT NULL,
  [StartDate] date DEFAULT NULL,
  [EndDate] date DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [projecttype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [projecttype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Type] varchar(50) DEFAULT NULL,
  [Description] NVARCHAR(MAX) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [property]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [property] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [OwnerID] bigINT DEFAULT NULL,
  [AreaSize] decimal(18,2) DEFAULT NULL,
  [Unit] varchar(50) DEFAULT NULL,
  [PIN] bigINT NOT NULL,
  [Block] varchar(50) DEFAULT NULL,
  [Lot] varchar(50) DEFAULT NULL,
  [Street] varchar(50) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] bigINT DEFAULT NULL,
  [RegionID] bigINT DEFAULT NULL,
  [ZipCode] INT DEFAULT NULL,
  [C] varchar(50) DEFAULT NULL,
  [Type] varchar(50) DEFAULT NULL,
  [Name] varchar(50) DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [SubClassification] varchar(50) DEFAULT NULL,
  [Preparedby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [OCT_TCT_CLOA_NO] varchar(50) DEFAULT NULL,
  [CoOwnerID] bigINT DEFAULT NULL,
  [BeneficialUserID] bigINT DEFAULT NULL,
  [AdministratorID] bigINT DEFAULT NULL,
  [AdvancePayment] bigINT DEFAULT NULL,
  [AdvanceYear] date DEFAULT NULL,
  [T_D_No] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Property] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [propertyassessmentlevel]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [propertyassessmentlevel] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [ClassificationID] bigINT DEFAULT NULL,
  [LandClassification] varchar(50) DEFAULT NULL,
  [ValueFrom] decimal(18,2) DEFAULT NULL,
  [ValueTo] decimal(18,2) DEFAULT NULL,
  [AssessmentLevel] tinyINT DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [propertyclassifications]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [propertyclassifications] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [GeneralRevisionYear] INT DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [SubClassification] varchar(50) DEFAULT NULL,
  [Createdby] varchar(50) DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] varchar(50) DEFAULT NULL,
  [ModifiedDate] date DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [UsingStatus] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [propertycoowners]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [propertycoowners] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [PropertyID] bigINT DEFAULT NULL,
  [CoOwnerID] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Createdby] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Property Co Owners] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [propertyimproved]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [propertyimproved] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [OwnerID] bigINT DEFAULT NULL,
  [AreaSize] decimal(18,2) DEFAULT NULL,
  [Unit] varchar(50) DEFAULT NULL,
  [LandPIN] bigINT DEFAULT NULL,
  [PIN] bigINT NOT NULL,
  [AddressID] bigINT DEFAULT NULL,
  [Block] varchar(50) DEFAULT NULL,
  [Lot] varchar(50) DEFAULT NULL,
  [Street] varchar(50) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] bigINT DEFAULT NULL,
  [RegionID] bigINT DEFAULT NULL,
  [ZipCode] INT DEFAULT NULL,
  [C] varchar(50) DEFAULT NULL,
  [Type] varchar(50) DEFAULT NULL,
  [Name] varchar(50) DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [SubClassification] varchar(50) DEFAULT NULL,
  [Preparedby] bigINT DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [OCT_TCT_CLOA_NO] varchar(50) DEFAULT NULL,
  [CoOwnerID] bigINT DEFAULT NULL,
  [BeneficialUserID] bigINT DEFAULT NULL,
  [AdministratorID] bigINT DEFAULT NULL,
  [AdvancePayment] bigINT DEFAULT NULL,
  [AdvanceYear] date DEFAULT NULL,
  [T_D_No] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [propertytaxdeclaration]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [propertytaxdeclaration] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [T_D_No] bigINT DEFAULT NULL,
  [PropertyID] bigINT DEFAULT NULL,
  [OwnerID] varchar(50) DEFAULT NULL,
  [OwnerTIN] bigINT DEFAULT NULL,
  [OwnerAddress] varchar(50) DEFAULT NULL,
  [OwnerTelephoneNumber] bigINT DEFAULT NULL,
  [BeneficialorAdminUserID] varchar(50) DEFAULT NULL,
  [BeneficialorAdminTIN] bigINT DEFAULT NULL,
  [BeneficialorAdminAddress] varchar(50) DEFAULT NULL,
  [BeneficialorAdminTelephoneNumber] bigINT DEFAULT NULL,
  [OCT/TCT/CLOA Number] bigINT DEFAULT NULL,
  [CCT] varchar(50) DEFAULT NULL,
  [LotNumber] varchar(50) DEFAULT NULL,
  [BlockNumber] varchar(50) DEFAULT NULL,
  [Dated] date DEFAULT NULL,
  [North] varchar(50) DEFAULT NULL,
  [East] varchar(50) DEFAULT NULL,
  [South] varchar(50) DEFAULT NULL,
  [West] varchar(50) DEFAULT NULL,
  [KindofProperty] varchar(50) DEFAULT NULL,
  [Description] varchar(200) DEFAULT NULL,
  [AssessedValue] decimal(18,2) DEFAULT NULL,
  [AmountInWords] varchar(100) DEFAULT NULL,
  [Taxable] tinyINT DEFAULT NULL,
  [SurveyNumber] bigINT DEFAULT NULL,
  [Type] varchar(50) DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [ActualUse] varchar(50) DEFAULT NULL,
  [Storeys] bigINT DEFAULT NULL,
  [MarketValue] decimal(18,2) DEFAULT NULL,
  [CancelTDNumber] bigINT DEFAULT NULL,
  [PreviousAssessedValue] decimal(18,2) DEFAULT NULL,
  [Createdby] varchar(50) DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Class] varchar(50) DEFAULT NULL,
  [AssessmentLevel] decimal(18,2) DEFAULT NULL,
  [Modifiedby] bigINT DEFAULT NULL,
  [Modifieddate] date DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [GeneralRevision] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Property Tax Declaration] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [province]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [province] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [PSGCCode] varchar(50) DEFAULT NULL,
  [RegionCode] varchar(50) DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [PIN] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [publicmarketticketing]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [publicmarketticketing] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [Items] varchar(250) DEFAULT NULL,
  [StartTime] varchar(50) DEFAULT NULL,
  [EndTime] varchar(50) DEFAULT NULL,
  [IssuedBy] varchar(250) DEFAULT NULL,
  [DateIssued] date DEFAULT NULL,
  [AmountIssued] decimal(10,2) DEFAULT NULL,
  [PostingPeriod] date DEFAULT NULL,
  [Remarks] NVARCHAR(MAX) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [purchaseitems]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [purchaseitems] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [Quantity] bigINT DEFAULT NULL,
  [Unit] varchar(50) DEFAULT NULL,
  [ItemID] bigINT DEFAULT NULL,
  [Cost] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [region]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [region] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [PSGCCode] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Region_1] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [scheduleofbaseunitmarketvalue]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [scheduleofbaseunitmarketvalue] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [GeneralRevisionYear] INT DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [Location] varchar(100) DEFAULT NULL,
  [Unit] varchar(50) DEFAULT NULL,
  [ActualUse] varchar(50) DEFAULT NULL,
  [SubClassification] varchar(50) DEFAULT NULL,
  [Price] decimal(18,2) DEFAULT NULL,
  [Createdby] varchar(50) DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [Modifiedby] varchar(50) DEFAULT NULL,
  [ModifiedDate] char(10) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [UsingStatus] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [serviceinvoiceaccounts]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [serviceinvoiceaccounts] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(150) DEFAULT NULL,
  [ChartofAccountsID] bigINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [Rate] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [signatories]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [signatories] (
  [ID] INT NOT NULL,
  [DocumentTypeID] INT DEFAULT NULL,
  [SequenceNumber] INT DEFAULT NULL,
  [EmployeeID] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [subdepartment]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [subdepartment] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [DepartmentID] bigINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Subdepartment] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [subfunds]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [subfunds] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(150) DEFAULT NULL,
  [Description] NVARCHAR(MAX) DEFAULT NULL,
  [Amount] decimal(18,2) DEFAULT NULL,
  [FundsID] bigINT DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [taxcode]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [taxcode] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(1000) DEFAULT NULL,
  [Rate] decimal(18,2) DEFAULT NULL,
  [Type] varchar(150) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Tax Code] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [taxdeclarationproperty]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [taxdeclarationproperty] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Kind] varchar(50) DEFAULT NULL,
  [T_D_No] bigINT DEFAULT NULL,
  [PropertyID] bigINT DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [Area] bigINT DEFAULT NULL,
  [MarketValue] decimal(18,2) DEFAULT NULL,
  [ActualUse] varchar(50) DEFAULT NULL,
  [AssessmentLevel] bigINT DEFAULT NULL,
  [AssessmentValue] decimal(18,2) DEFAULT NULL,
  [GeneralRevision] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [transactionitems]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [transactionitems] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [ItemID] bigINT DEFAULT NULL,
  [ChargeAccountID] bigINT DEFAULT NULL,
  [Quantity] decimal(18,2) DEFAULT NULL,
  [ItemUnitID] bigINT DEFAULT NULL,
  [Price] decimal(18,2) DEFAULT NULL,
  [PriceVatExclusive] decimal(18,2) DEFAULT NULL,
  [Sub_Total] decimal(18,2) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [TAXCodeID] bigINT DEFAULT NULL,
  [UniqueID] char(36)   DEFAULT NULL,
  [Debit] decimal(18,2) DEFAULT NULL,
  [Credit] decimal(18,2) DEFAULT NULL,
  [Discounted] decimal(18,2) DEFAULT NULL,
  [Sub_Total_Vat_Ex] decimal(18,2) DEFAULT NULL,
  [BankID] bigINT DEFAULT NULL,
  [SecondAccountID] bigINT DEFAULT NULL,
  [TaxName] varchar(50) DEFAULT NULL,
  [TaxRate] decimal(18,2) DEFAULT NULL,
  [VoucherLink] bigINT DEFAULT NULL,
  [InvoiceNumber] varchar(150) DEFAULT NULL,
  [Remarks] NVARCHAR(MAX) DEFAULT NULL,
  [EWT] decimal(18,2) DEFAULT NULL,
  [WithheldAmount] decimal(18,2) DEFAULT NULL,
  [Vat_Total] decimal(18,2) DEFAULT NULL,
  [EWTRate] decimal(18,2) DEFAULT NULL,
  [Discounts] decimal(18,2) DEFAULT NULL,
  [DiscountRate] decimal(18,2) DEFAULT NULL,
  [AmountDue] decimal(18,2) DEFAULT NULL,
  [FPP] varchar(250) DEFAULT NULL,
  [NormalBalance] varchar(150) DEFAULT NULL,
  [ResponsibilityCenter] varchar(50) DEFAULT NULL,
  [Vatable] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [transactionproperty]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [transactionproperty] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] NVARCHAR(MAX) DEFAULT NULL,
  [Municipality] varchar(50) DEFAULT NULL,
  [Owner] varchar(100) DEFAULT NULL,
  [Location] varchar(100) DEFAULT NULL,
  [LotAndBlock] varchar(50) DEFAULT NULL,
  [T_D_No] varchar(50) DEFAULT NULL,
  [Classification] varchar(50) DEFAULT NULL,
  [LandPrice] decimal(18,2) DEFAULT NULL,
  [ImprovementPrice] decimal(18,2) DEFAULT NULL,
  [TotalAssessedValue] decimal(18,2) DEFAULT NULL,
  [TaxDue] varchar(50) DEFAULT NULL,
  [Installment_No] decimal(18,2) DEFAULT NULL,
  [InstallmentPayment] decimal(18,2) DEFAULT NULL,
  [RemainingBalance] decimal(18,2) DEFAULT NULL,
  [FullPayment] decimal(18,2) DEFAULT NULL,
  [Penalty] decimal(18,2) DEFAULT NULL,
  [Total] decimal(18,2) DEFAULT NULL,
  [RequestedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] date DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [Block] varchar(50) DEFAULT NULL,
  [Discount] varchar(50) DEFAULT NULL,
  [Present] tinyINT DEFAULT NULL,
  [Lot] varchar(50) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [transactiontable]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [transactiontable] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] varchar(50) DEFAULT NULL,
  [Status] varchar(50) DEFAULT NULL,
  [APAR] varchar(150) DEFAULT NULL,
  [DocumentTypeID] bigINT DEFAULT NULL,
  [RequestedBy] bigINT DEFAULT NULL,
  [InvoiceDate] date DEFAULT NULL,
  [CustomerID] bigINT DEFAULT NULL,
  [CustomerName] varchar(250) DEFAULT NULL,
  [ReferenceNumber] varchar(150) DEFAULT NULL,
  [P_O_Number] varchar(150) DEFAULT NULL,
  [D_R_Number] varchar(150) DEFAULT NULL,
  [InvoiceNumber] varchar(150) DEFAULT NULL,
  [BillingDueDate] date DEFAULT NULL,
  [BillingAddress] NVARCHAR(MAX) DEFAULT NULL,
  [ShippingAddress] NVARCHAR(MAX) DEFAULT NULL,
  [PaymentTermsID] bigINT DEFAULT NULL,
  [PaymentMethodID] bigINT DEFAULT NULL,
  [Total] decimal(18,2) DEFAULT NULL,
  [AmountReceived] decimal(18,2) DEFAULT NULL,
  [RemainingBalance] decimal(18,2) DEFAULT NULL,
  [PaymentType] varchar(50) DEFAULT NULL,
  [Remarks] varchar(500) DEFAULT NULL,
  [Credit] decimal(18,2) DEFAULT NULL,
  [Debit] decimal(18,2) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [PlaceIssued] varchar(150) DEFAULT NULL,
  [TIN] varchar(150) DEFAULT NULL,
  [BusinessEarnings] decimal(18,2) DEFAULT NULL,
  [OccupationEarnings] decimal(18,2) DEFAULT NULL,
  [IncomeProperty] decimal(18,2) DEFAULT NULL,
  [BusinessTaxDue] decimal(18,2) DEFAULT NULL,
  [OccupationTaxDue] decimal(18,2) DEFAULT NULL,
  [PropertyTaxDue] decimal(18,2) DEFAULT NULL,
  [Interest] decimal(18,2) DEFAULT NULL,
  [BasicTax] decimal(18,2) DEFAULT NULL,
  [Year] varchar(50) DEFAULT NULL,
  [BankID] varchar(50) DEFAULT NULL,
  [uniqueID] char(36)   DEFAULT NULL,
  [Municipality] varchar(50) DEFAULT NULL,
  [LandValue] decimal(18,2) DEFAULT NULL,
  [ImprovementValue] decimal(18,2) DEFAULT NULL,
  [ReceivedFrom] varchar(50) DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [TaxName] varchar(150) DEFAULT NULL,
  [TaxRate] decimal(18,2) DEFAULT NULL,
  [VendorID] bigINT DEFAULT NULL,
  [TaxableSale] decimal(18,2) DEFAULT NULL,
  [ReceivedPaymentBy] NVARCHAR(MAX) DEFAULT NULL,
  [CheckNumber] varchar(100) DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [AmountinWords] NVARCHAR(MAX) DEFAULT NULL,
  [PreviousPayment] decimal(18,2) DEFAULT NULL,
  [PropertyID] varchar(50) DEFAULT NULL,
  [EWT] decimal(18,2) DEFAULT NULL,
  [WithheldAmount] decimal(18,2) DEFAULT NULL,
  [Vat_Total] decimal(18,2) DEFAULT NULL,
  [Discounts] decimal(18,2) DEFAULT NULL,
  [AmountDue] decimal(18,2) DEFAULT NULL,
  [VATExcludedPrice] decimal(18,2) DEFAULT NULL,
  [ModeofPayment] varchar(50) DEFAULT NULL,
  [EmployeeID] bigINT DEFAULT NULL,
  [ResponsibilityCenter] bigINT DEFAULT NULL,
  [T_D_No] NVARCHAR(MAX) DEFAULT NULL,
  [OfficeUnitProject] varchar(150) DEFAULT NULL,
  [Balance] decimal(18,2) DEFAULT NULL,
  [ObligationRequestNumber] varchar(150) DEFAULT NULL,
  [ApprovalProgress] INT DEFAULT NULL,
  [BudgetID] bigINT DEFAULT NULL,
  [TargetID] bigINT DEFAULT NULL,
  [FundsID] bigINT DEFAULT NULL,
  [ContraAccountID] bigINT DEFAULT NULL,
  [ContraNormalBalance] varchar(50) DEFAULT NULL,
  [Paid] tinyINT DEFAULT NULL,
  [GeneralRevision] INT DEFAULT NULL,
  [InstallmentID] bigINT DEFAULT NULL,
  [ApprovalVersion] varchar(50) DEFAULT NULL,
  [AdvancedYear] INT DEFAULT NULL,
  [AdvanceFunds] decimal(18,2) DEFAULT NULL,
  [JEVType] varchar(50) DEFAULT NULL,
  [TravelLink] varchar(150) DEFAULT NULL,
  [FiscalYearID] bigINT DEFAULT NULL,
  [ProjectID] bigINT DEFAULT NULL,
  [SAI_No] varchar(50) DEFAULT NULL,
  [SAIDate] date DEFAULT NULL,
  [ALOBSDate] date DEFAULT NULL,
  [PayeeBank] varchar(150) DEFAULT NULL,
  [CheckDate] date DEFAULT NULL,
  [MoneyOrder] varchar(150) DEFAULT NULL,
  [MoneyOrderDate] date DEFAULT NULL,
  [PostingDate] date DEFAULT NULL,
  [CurrentBalance] decimal(18,2) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [traveldocuments]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [traveldocuments] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [Name] varchar(100) DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [travelers]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [travelers] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [TravelerID] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [travelorder]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [travelorder] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Status] varchar(50) DEFAULT NULL,
  [LinkID] bigINT DEFAULT NULL,
  [InvoiceNumber] varchar(150) DEFAULT NULL,
  [CreatedBy] bigINT DEFAULT NULL,
  [TravelerID] bigINT DEFAULT NULL,
  [BudgetID] bigINT DEFAULT NULL,
  [DateCreated] date DEFAULT NULL,
  [DateStart] date DEFAULT NULL,
  [DateEnd] date DEFAULT NULL,
  [No_of_Days] bigINT DEFAULT NULL,
  [InclusivesDate] varchar(100) DEFAULT NULL,
  [Purpose] NVARCHAR(MAX) DEFAULT NULL,
  [Place] NVARCHAR(MAX) DEFAULT NULL,
  [Venue] NVARCHAR(MAX) DEFAULT NULL,
  [RequiredDocuments] NVARCHAR(MAX) DEFAULT NULL,
  [Cost] decimal(18,2) DEFAULT NULL,
  [Remarks] varchar(100) DEFAULT NULL,
  [Plane] tinyINT DEFAULT NULL,
  [Vessels] tinyINT DEFAULT NULL,
  [PUV] tinyINT DEFAULT NULL,
  [ServiceVehicle] tinyINT DEFAULT NULL,
  [RentedVehicle] tinyINT DEFAULT NULL,
  [ApprovalProgress] bigINT DEFAULT NULL,
  [ApprovalVersion] varchar(50) DEFAULT NULL,
  [ObligationLink] varchar(150) DEFAULT NULL,
  [DepartmentID] bigINT DEFAULT NULL,
  [PositionID] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [travelpayment]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [travelpayment] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [LinkID] bigINT DEFAULT NULL,
  [Amount] decimal(18,2) DEFAULT NULL,
  [Type] tinyINT DEFAULT NULL,
  [BudgetID] bigINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed

--
-- Table structure for table [useraccess]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [useraccess] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Description] varchar(150) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(50) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_User Access] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [users]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [users] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [EmployeeID] bigINT DEFAULT NULL,
  [UserName] varchar(255) NOT NULL,
  [Password] varchar(255) NOT NULL,
  [UserAccessID] bigINT DEFAULT NULL,
  [Active] tinyINT NOT NULL,
  [CreatedBy] varchar(255) NOT NULL,
  [CreatedDate] datetime NOT NULL,
  [PositionID] INT DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Users] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [useruseraccess]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [useruseraccess] (
  [id] INT NOT NULL IDENTITY(1,1),
  [UserID] bigINT DEFAULT NULL,
  [UserAccessID] bigINT DEFAULT NULL,
  [createdAt] datetime NOT NULL,
  [updatedAt] datetime NOT NULL,
  PRIMARY KEY ([id])
);
-- MySQL Header Removed

--
-- Table structure for table [vendor]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [vendor] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Code] varchar(50) DEFAULT NULL,
  [Name] varchar(250) DEFAULT NULL,
  [PaymentTermsID] bigINT DEFAULT NULL,
  [PaymentMethodID] bigINT DEFAULT NULL,
  [DeliveryLeadTime] INT DEFAULT NULL,
  [TIN] varchar(50) DEFAULT NULL,
  [RDO] varchar(50) DEFAULT NULL,
  [Vatable] tinyINT DEFAULT NULL,
  [TaxCodeID] bigINT DEFAULT NULL,
  [TypeID] bigINT DEFAULT NULL,
  [IndustryTypeID] bigINT DEFAULT NULL,
  [ContactPerson] varchar(500) DEFAULT NULL,
  [PhoneNumber] varchar(150) DEFAULT NULL,
  [MobileNumber] varchar(150) DEFAULT NULL,
  [EmailAddress] varchar(150) DEFAULT NULL,
  [Website] varchar(250) DEFAULT NULL,
  [StreetAddress] varchar(500) DEFAULT NULL,
  [BarangayID] bigINT DEFAULT NULL,
  [MunicipalityID] varchar(50) DEFAULT NULL,
  [ProvinceID] varchar(50) DEFAULT NULL,
  [RegionID] varchar(50) DEFAULT NULL,
  [ZIPCode] varchar(50) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  [PlaceofIncorporation] varchar(350) DEFAULT NULL,
  [KindofOrganization] varchar(150) DEFAULT NULL,
  [DateofRegistration] date DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_Vendor] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [vendorcustomertype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [vendorcustomertype] (
  [ID] INT NOT NULL IDENTITY(1,1),
  [Name] varchar(150) DEFAULT NULL,
  [Active] bigINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_VendorCustomerType] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [vendortype]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [vendortype] (
  [ID] bigINT NOT NULL IDENTITY(1,1),
  [Name] varchar(250) DEFAULT NULL,
  [Active] tinyINT DEFAULT NULL,
  [CreatedBy] varchar(150) DEFAULT NULL,
  [CreatedDate] datetime DEFAULT NULL,
  [ModifyBy] varchar(150) DEFAULT NULL,
  [ModifyDate] datetime DEFAULT NULL,
  PRIMARY KEY ([ID])
--   UNIQUE KEY [PK_VendorType] ([ID])
 -- COMMENTED OUT (MySQL Index)
);
-- MySQL Header Removed

--
-- Table structure for table [watermarks]
--

-- DROP TABLE SKIPPED
-- MySQL Header Removed
-- MySQL Header Removed
CREATE TABLE [watermarks] (
  [ID] INT NOT NULL,
  [Confidential] tinyINT DEFAULT NULL,
  [LGUName] tinyINT DEFAULT NULL,
  PRIMARY KEY ([ID])
);
-- MySQL Header Removed
-- MySQL Header Removed

-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed
-- MySQL Header Removed



