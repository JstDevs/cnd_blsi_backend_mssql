/* 
   SQL Script for MSSQL to remove Budget Details, Allotment, Supplemental, Transfer, OBR, and DV data
   and reset Budget balances to the "Total Available" (Appropriation-based) state.
*/

BEGIN TRANSACTION;

-- 1. Burahin ang mga Child Records na naka-link sa mga transactions na ito:
-- 13: Obligation Request (OBR)
-- 14: Disbursement Voucher (DV)
-- 20: Budget Allotment (Allotment Release Order)
-- 21: Budget Supplemental
-- 22: Budget Transfer

-- Transaction Items
DELETE FROM [TransactionItems] 
WHERE LinkID IN (
    SELECT LinkID FROM [TransactionTable] 
    WHERE DocumentTypeID IN (13, 14, 20, 21, 22)
);

-- Attachments
DELETE FROM [Attachment] 
WHERE LinkID IN (
    SELECT LinkID FROM [TransactionTable] 
    WHERE DocumentTypeID IN (13, 14, 20, 21, 22)
);

-- Approval Audit Logs
DELETE FROM [ApprovalAudit] 
WHERE InvoiceLink IN (
    SELECT LinkID FROM [TransactionTable] 
    WHERE DocumentTypeID IN (13, 14, 20, 21, 22)
);

-- Contra Accounts (Relevant for DV)
DELETE FROM [ContraAccount] 
WHERE LinkID IN (
    SELECT LinkID FROM [TransactionTable] 
    WHERE DocumentTypeID IN (13, 14, 20, 21, 22)
);

-- General Ledger Entries
DELETE FROM [GeneralLedger] 
WHERE LinkID IN (
    SELECT LinkID FROM [TransactionTable] 
    WHERE DocumentTypeID IN (13, 14, 20, 21, 22)
);

-- 2. Burahin ang mismong mga Transactions
DELETE FROM [TransactionTable] 
WHERE DocumentTypeID IN (13, 14, 20, 21, 22);

-- 3. I-reset ang Budget Balances sa Initial State (Interpretation B)
-- Dahil AllotmentBalance starts as Appropriation (Total Available)
UPDATE [Budget] SET 
    Supplemental = 0,
    Transfer = 0,
    Released = 0,
    AllotmentBalance = Appropriation,
    AppropriationBalance = Appropriation,
    PreEncumbrance = 0,
    Encumbrance = 0,
    Charges = 0,
    ChargedAllotment = 0;

-- 4. I-reset ang Document Numbers (Optional: Idagdag ito kung gusto mong magsimula ulit ang series sa 1)
-- UPDATE [DocumentType] SET CurrentNumber = 0 WHERE ID IN (13, 14, 20, 21, 22);

COMMIT;