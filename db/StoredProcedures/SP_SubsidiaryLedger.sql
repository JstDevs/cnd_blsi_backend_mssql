DELIMITER $$

DROP PROCEDURE IF EXISTS SP_SubsidiaryLedger $$

CREATE PROCEDURE SP_SubsidiaryLedger (
    IN accountCode VARCHAR(50),
    IN fundID VARCHAR(50),
    IN cutoff VARCHAR(50)
)
BEGIN
    SELECT 
        gle.ID AS id,
        fnd.Name AS fund,
        gle.AccountName AS account_name,
        gle.AccountCode AS account_code,
        DATE(gle.CreatedDate) AS date,
        gle.LedgerItem AS ledger_item,
        CASE
            WHEN IFNULL(gle.Debit, 0) = 0.00 THEN NULL
            ELSE gle.Debit
        END AS debit,
        CASE
            WHEN IFNULL(gle.Credit, 0) = 0.00 THEN NULL
            ELSE gle.Credit
        END AS credit,
        SUM(IFNULL(gle.Debit, 0) - IFNULL(gle.Credit, 0)) OVER (ORDER BY gle.CreatedDate, gle.ID) AS balance,
        lmu.Name AS municipality
    FROM generalledger AS gle
    INNER JOIN funds AS fnd ON fnd.ID = gle.FundID
    INNER JOIN lgu AS lgu ON lgu.ID = 1
    LEFT JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    WHERE (gle.AccountCode LIKE accountCode OR accountCode = '%')
      AND (CONCAT(gle.FundID, '') LIKE fundID OR fundID = '%')
      AND DATE(gle.CreatedDate) <= DATE(cutoff);
END $$

DELIMITER ;
