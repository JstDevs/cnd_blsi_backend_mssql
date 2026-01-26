DELIMITER $$

DROP PROCEDURE IF EXISTS SP_GeneralLedger $$

CREATE PROCEDURE SP_GeneralLedger (
    IN p_accountCode VARCHAR(50),
    IN p_fundID VARCHAR(50),
    IN p_cutoff VARCHAR(50)
)
BEGIN
    -- Standardize dash-less match
    SET @cleanMatch = REPLACE(p_accountCode, '-', '');
    IF @cleanMatch = '' THEN SET @cleanMatch = '%'; END IF;

    SELECT 
        tbl.id,
        tbl.transaction_id,
        tbl.link_id,
        tbl.ap_ar,
        tbl.fund,
        tbl.account_name,
        tbl.account_code,
        tbl.date,
        tbl.ledger_item,
        tbl.invoice_number,
        tbl.account_code_display,
        tbl.account_name_display,
        tbl.debit,
        tbl.credit,
        CASE
            WHEN SUM(IFNULL(tbl.debit, 0) - IFNULL(tbl.credit, 0)) OVER (ORDER BY tbl.date, tbl.invoice_number, tbl.id) = 0.00 THEN 0.00
            ELSE SUM(IFNULL(tbl.debit, 0) - IFNULL(tbl.credit, 0)) OVER (ORDER BY tbl.date, tbl.invoice_number, tbl.id)
        END AS balance,
        tbl.municipality
    FROM (
        -- Part 1: Journal Entry Voucher
        SELECT 
            jev.ID AS id,
            trt.ID AS transaction_id,
            trt.LinkID AS link_id,
            trt.APAR AS ap_ar,
            IFNULL(fnd.Name, 'N/A') AS fund,
            jev.AccountName AS account_name,
            jev.AccountCode AS account_code,
            DATE(jev.CreatedDate) AS date,
            jev.LedgerItem AS ledger_item,
            trt.InvoiceNumber AS invoice_number,
            p_accountCode AS account_code_display,
            jev.AccountName AS account_name_display,
            jev.Debit AS debit,
            jev.Credit AS credit,
            '' AS municipality
        FROM journalentryvoucher jev
        JOIN transactiontable trt ON TRIM(trt.LinkID) = TRIM(jev.LinkID)
        LEFT JOIN funds fnd ON fnd.ID = trt.FundsID
        WHERE (trt.APAR LIKE '%Journal Entry Voucher%' OR trt.APAR LIKE '%JEV%')
          AND trt.Status IN ('Posted', 'approved', 'Approved')
          AND (REPLACE(jev.AccountCode, '-', '') LIKE @cleanMatch OR p_accountCode = '%')
          AND (CONCAT(trt.FundsID, '') LIKE p_fundID OR p_fundID = '%')
          AND DATE(jev.CreatedDate) <= DATE(p_cutoff)

        UNION ALL

        -- Part 2: Disbursement Voucher
        SELECT 
            tri.ID AS id,
            trt.ID AS transaction_id,
            trt.LinkID AS link_id,
            trt.APAR AS ap_ar,
            IFNULL(fnd.Name, 'N/A') AS fund,
            coa.Name AS account_name,
            coa.AccountCode AS account_code,
            trt.InvoiceDate AS date,
            'Disbursement Entry' AS ledger_item,
            trt.InvoiceNumber AS invoice_number,
            p_accountCode AS account_code_display,
            coa.Name AS account_name_display,
            trt.Debit AS debit,
            trt.Credit AS credit,
            '' AS municipality
        FROM transactiontable trt
        JOIN transactionitems tri ON TRIM(tri.LinkID) = TRIM(trt.LinkID)
        JOIN chartofaccounts coa ON coa.ID = tri.ChargeAccountID
        LEFT JOIN funds fnd ON fnd.ID = trt.FundsID
        WHERE (trt.APAR LIKE '%Disbursement Voucher%' OR trt.APAR LIKE '%DV%')
          AND trt.Status IN ('Posted', 'approved', 'Approved')
          AND (REPLACE(coa.AccountCode, '-', '') LIKE @cleanMatch OR p_accountCode = '%')
          AND (CONCAT(trt.FundsID, '') LIKE p_fundID OR p_fundID = '%')
          AND DATE(trt.InvoiceDate) <= DATE(p_cutoff)

    ) AS tbl
    ORDER BY date, id;

END $$

DELIMITER ;
