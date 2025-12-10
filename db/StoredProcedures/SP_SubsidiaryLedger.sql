DELIMITER $$

CREATE PROCEDURE SP_SubsidiaryLedger (
    IN accountCode VARCHAR(50),
    IN fundID VARCHAR(50),
    IN cutoff VARCHAR(50)
)
BEGIN
    SELECT 
        gle.ID,
        fnd.Name AS Fund,
        gle.AccountName,
        gle.AccountCode,
        DATE(gle.CreatedDate) AS Date,
        gle.LedgerItem,
        CASE
            WHEN gle.Debit = 0.00 THEN NULL
            ELSE gle.Debit
        END AS Debit,
        CASE
            WHEN gle.Credit = 0.00 THEN NULL
            ELSE gle.Credit
        END AS Credit,
        CASE
            WHEN SUM(gle.Debit) OVER (ORDER BY gle.ID) = 0.00 THEN NULL
            ELSE SUM(gle.Debit) OVER (ORDER BY gle.ID)
        END AS Balance,
        lmu.Name AS Municipality
    FROM generalledger AS gle
    LEFT JOIN transactionitems AS tri ON tri.LinkID = gle.LinkID
    LEFT JOIN transactiontable AS trt ON trt.LinkID = gle.LinkID
    INNER JOIN funds AS fnd ON fnd.ID = gle.FundID
    INNER JOIN lgu AS lgu ON lgu.ID = 1
    LEFT JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    WHERE gle.AccountCode LIKE accountCode COLLATE utf8mb4_general_ci
      AND gle.FundID LIKE fundID COLLATE utf8mb4_general_ci
      AND gle.CreatedDate <= cutoff
      AND gle.CreatedDate >= CONCAT(LEFT(cutoff, 4), '-01-01');
END $$

DELIMITER ;
