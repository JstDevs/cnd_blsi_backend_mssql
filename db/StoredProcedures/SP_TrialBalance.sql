DELIMITER $$

CREATE PROCEDURE SP_TrialBalance(
  IN endDate VARCHAR(50),
  IN fundID VARCHAR(50),
  IN approver VARCHAR(50),
  IN sub VARCHAR(50)
)
BEGIN
  SELECT 
    REPLACE(glg.AccountCode, '-', '') AS AccountCode,
    glg.AccountName,
    SUM(glg.Debit) AS Debit,
    SUM(glg.Credit) AS Credit,
    endDate AS EndDate,
    CASE
      WHEN fundID = '%'
      THEN 'All Funds'
      ELSE glg.FundName
    END AS Funds,
    CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName) AS FullName,
    UPPER(pos.Name) AS Position,
    UPPER(lmu.Name) AS Municipality
  FROM generalledger glg
  INNER JOIN chartofaccounts coa ON coa.AccountCode = glg.AccountCode
  INNER JOIN budget bud ON bud.ChartofAccountsID = coa.ID
  INNER JOIN fiscalyear fsy ON fsy.ID = bud.FiscalYearID
  INNER JOIN employee emp ON emp.ID = approver
  INNER JOIN position pos ON pos.ID = emp.PositionID
  INNER JOIN lgu lgu ON lgu.ID = 1
  INNER JOIN municipality lmu ON lmu.ID = lgu.MunicipalityID
  WHERE glg.FundID LIKE fundID
    AND glg.CreatedDate >= fsy.MonthStart
    AND glg.CreatedDate <= endDate
    AND LENGTH(REPLACE(glg.AccountCode, '-', '')) <= sub
  GROUP BY 
    glg.AccountCode,
    glg.AccountName,
    glg.FundName,
    CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName),
    pos.Name,
    lmu.Name;
END $$

DELIMITER ;
