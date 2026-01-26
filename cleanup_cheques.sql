-- SQL Cleanup Script for Cheque Data
-- Run this in your MySQL/MariaDB editor (e.g., cnd database)

DELETE FROM approvalaudit 
WHERE InvoiceLink IN (SELECT LinkID FROM `check`);

DELETE FROM `check`;

UPDATE transactiontable 
SET Status = 'Posted, Cheque Pending' 
WHERE APAR LIKE '%Disbursement Voucher%' 
  AND Status LIKE '%Cheque Posted%';

UPDATE transactiontable 
SET Status = 'Posted, Disbursement Posted' 
WHERE (APAR LIKE '%Obligation Request%' OR APAR LIKE '%Fund Utilization Request%') 
  AND Status LIKE '%Cheque Posted%';
