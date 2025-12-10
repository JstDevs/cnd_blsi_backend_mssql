DELIMITER $$

CREATE PROCEDURE display_BudgetReport (
  IN startDate VARCHAR(50) CHARACTER SET utf8mb4,
  IN endDate VARCHAR(50) CHARACTER SET utf8mb4,
  IN depID VARCHAR(50) CHARACTER SET utf8mb4,
  IN fiscalID VARCHAR(50) CHARACTER SET utf8mb4,
  IN fundID VARCHAR(50) CHARACTER SET utf8mb4
)
BEGIN
  SELECT
    coa.Name AS AccountName,
    REPLACE(coa.AccountCode, '-', '') AS AccountCode,
    bud.Appropriation AS Appropriated,
    COALESCE(SUM(tts.Total), 0) + COALESCE(SUM(ttt.Total), 0) AS Adjustments,
    COALESCE(SUM(tta.Total), 0) AS Allotments,
    COALESCE(SUM(ttc.Total), 0) AS Obligations,
    bud.Appropriation + COALESCE(SUM(tts.Total), 0) + COALESCE(SUM(ttt.Total), 0) - COALESCE(SUM(tta.Total), 0) AS AppropriationBalance,
    CASE
      WHEN SUM(ttc.Total) IS NULL THEN COALESCE(SUM(tta.Total), 0)
      ELSE COALESCE(SUM(tta.Total), 0) - COALESCE(SUM(ttc.Total), 0)
    END AS AllotmentBalance
  FROM budget AS bud
    INNER JOIN chartofaccounts AS coa ON coa.ID = bud.ChartOfAccountsID
    INNER JOIN funds AS fnd ON fnd.ID = bud.FundID
    INNER JOIN department AS dep ON dep.ID = bud.DepartmentID
    LEFT JOIN transactiontable AS tts ON tts.BudgetID = bud.ID AND tts.APAR = 'Budget Supplemental' AND tts.CreatedDate BETWEEN startDate AND endDate
    LEFT JOIN transactiontable AS ttt ON ttt.BudgetID = bud.ID AND ttt.APAR = 'Budget Transfer' AND ttt.CreatedDate BETWEEN startDate AND endDate
    LEFT JOIN transactiontable AS tta ON tta.BudgetID = bud.ID AND tta.APAR = 'Allotment Release Order' AND tta.CreatedDate BETWEEN startDate AND endDate
    LEFT JOIN transactiontable AS ttc ON ttc.ContraAccountID = coa.ID AND ttc.APAR = 'Disbursement Voucher' AND ttc.CreatedDate BETWEEN startDate AND endDate
    INNER JOIN lgu AS lgu ON lgu.ID = 1
    INNER JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    INNER JOIN province AS lpr ON lpr.ID = lgu.ProvinceID
  WHERE bud.CreatedDate BETWEEN startDate AND endDate
    AND bud.DepartmentID LIKE depID
    AND bud.FiscalYearID LIKE fiscalID
    AND fnd.ID LIKE fundID
  GROUP BY
    coa.Name,
    coa.AccountCode,
    bud.Appropriation,
    coa.ID
  ORDER BY coa.ID;
END $$

DELIMITER ;
