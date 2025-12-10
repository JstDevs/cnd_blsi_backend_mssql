const { transactionTable } = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { LinkID, Status, APAR, DocumentTypeID, RequestedBy, InvoiceDate, CustomerID, CustomerName, ReferenceNumber, P_O_Number, D_R_Number, InvoiceNumber, BillingDueDate, BillingAddress, ShippingAddress, PaymentTermsID, PaymentMethodID, Total, AmountReceived, RemainingBalance, PaymentType, Remarks, Credit, Debit, Active, PlaceIssued, TIN, BusinessEarnings, OccupationEarnings, IncomeProperty, BusinessTaxDue, OccupationTaxDue, PropertyTaxDue, Interest, BasicTax, Year, BankID, uniqueID, Municipality, LandValue, ImprovementValue, ReceivedFrom, CreatedBy, CreatedDate, TaxName, TaxRate, VendorID, TaxableSale, ReceivedPaymentBy, CheckNumber, ModifyBy, ModifyDate, AmountinWords, PreviousPayment, PropertyID, EWT, WithheldAmount, Vat_Total, Discounts, AmountDue, VATExcludedPrice, ModeofPayment, EmployeeID, ResponsibilityCenter, T_D_No, OfficeUnitProject, Balance, ObligationRequestNumber, ApprovalProgress, BudgetID, TargetID, FundsID, ContraAccountID, ContraNormalBalance, Paid, GeneralRevision, InstallmentID, ApprovalVersion, AdvancedYear, AdvanceFunds, JEVType, TravelLink, FiscalYearID, ProjectID, SAI_No, SAIDate, ALOBSDate, PayeeBank, CheckDate, MoneyOrder, MoneyOrderDate, PostingDate, CurrentBalance } = req.body;
    const item = await transactionTable.create({ LinkID, Status, APAR, DocumentTypeID, RequestedBy, InvoiceDate, CustomerID, CustomerName, ReferenceNumber, P_O_Number, D_R_Number, InvoiceNumber, BillingDueDate, BillingAddress, ShippingAddress, PaymentTermsID, PaymentMethodID, Total, AmountReceived, RemainingBalance, PaymentType, Remarks, Credit, Debit, Active, PlaceIssued, TIN, BusinessEarnings, OccupationEarnings, IncomeProperty, BusinessTaxDue, OccupationTaxDue, PropertyTaxDue, Interest, BasicTax, Year, BankID, uniqueID, Municipality, LandValue, ImprovementValue, ReceivedFrom, CreatedBy, CreatedDate, TaxName, TaxRate, VendorID, TaxableSale, ReceivedPaymentBy, CheckNumber, ModifyBy, ModifyDate, AmountinWords, PreviousPayment, PropertyID, EWT, WithheldAmount, Vat_Total, Discounts, AmountDue, VATExcludedPrice, ModeofPayment, EmployeeID, ResponsibilityCenter, T_D_No, OfficeUnitProject, Balance, ObligationRequestNumber, ApprovalProgress, BudgetID, TargetID, FundsID, ContraAccountID, ContraNormalBalance, Paid, GeneralRevision, InstallmentID, ApprovalVersion, AdvancedYear, AdvanceFunds, JEVType, TravelLink, FiscalYearID, ProjectID, SAI_No, SAIDate, ALOBSDate, PayeeBank, CheckDate, MoneyOrder, MoneyOrderDate, PostingDate, CurrentBalance });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await transactionTable.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await transactionTable.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "transactionTable not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { LinkID, Status, APAR, DocumentTypeID, RequestedBy, InvoiceDate, CustomerID, CustomerName, ReferenceNumber, P_O_Number, D_R_Number, InvoiceNumber, BillingDueDate, BillingAddress, ShippingAddress, PaymentTermsID, PaymentMethodID, Total, AmountReceived, RemainingBalance, PaymentType, Remarks, Credit, Debit, Active, PlaceIssued, TIN, BusinessEarnings, OccupationEarnings, IncomeProperty, BusinessTaxDue, OccupationTaxDue, PropertyTaxDue, Interest, BasicTax, Year, BankID, uniqueID, Municipality, LandValue, ImprovementValue, ReceivedFrom, CreatedBy, CreatedDate, TaxName, TaxRate, VendorID, TaxableSale, ReceivedPaymentBy, CheckNumber, ModifyBy, ModifyDate, AmountinWords, PreviousPayment, PropertyID, EWT, WithheldAmount, Vat_Total, Discounts, AmountDue, VATExcludedPrice, ModeofPayment, EmployeeID, ResponsibilityCenter, T_D_No, OfficeUnitProject, Balance, ObligationRequestNumber, ApprovalProgress, BudgetID, TargetID, FundsID, ContraAccountID, ContraNormalBalance, Paid, GeneralRevision, InstallmentID, ApprovalVersion, AdvancedYear, AdvanceFunds, JEVType, TravelLink, FiscalYearID, ProjectID, SAI_No, SAIDate, ALOBSDate, PayeeBank, CheckDate, MoneyOrder, MoneyOrderDate, PostingDate, CurrentBalance } = req.body;
    const [updated] = await transactionTable.update({ LinkID, Status, APAR, DocumentTypeID, RequestedBy, InvoiceDate, CustomerID, CustomerName, ReferenceNumber, P_O_Number, D_R_Number, InvoiceNumber, BillingDueDate, BillingAddress, ShippingAddress, PaymentTermsID, PaymentMethodID, Total, AmountReceived, RemainingBalance, PaymentType, Remarks, Credit, Debit, Active, PlaceIssued, TIN, BusinessEarnings, OccupationEarnings, IncomeProperty, BusinessTaxDue, OccupationTaxDue, PropertyTaxDue, Interest, BasicTax, Year, BankID, uniqueID, Municipality, LandValue, ImprovementValue, ReceivedFrom, CreatedBy, CreatedDate, TaxName, TaxRate, VendorID, TaxableSale, ReceivedPaymentBy, CheckNumber, ModifyBy, ModifyDate, AmountinWords, PreviousPayment, PropertyID, EWT, WithheldAmount, Vat_Total, Discounts, AmountDue, VATExcludedPrice, ModeofPayment, EmployeeID, ResponsibilityCenter, T_D_No, OfficeUnitProject, Balance, ObligationRequestNumber, ApprovalProgress, BudgetID, TargetID, FundsID, ContraAccountID, ContraNormalBalance, Paid, GeneralRevision, InstallmentID, ApprovalVersion, AdvancedYear, AdvanceFunds, JEVType, TravelLink, FiscalYearID, ProjectID, SAI_No, SAIDate, ALOBSDate, PayeeBank, CheckDate, MoneyOrder, MoneyOrderDate, PostingDate, CurrentBalance }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await transactionTable.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "transactionTable not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await transactionTable.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "transactionTable deleted" });
    else res.status(404).json({ message: "transactionTable not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};