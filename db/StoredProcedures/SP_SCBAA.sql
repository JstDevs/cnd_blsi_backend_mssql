SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('[dbo].[SP_SCBAA]', 'P') IS NOT NULL
DROP PROCEDURE [dbo].[SP_SCBAA]
GO

CREATE PROCEDURE [dbo].[SP_SCBAA] (
  @fiscalYear VARCHAR(50)
)
AS
BEGIN
  SELECT
    act.Name AS Type,
    acs.ID AS SubID,
    acs.Name AS Subtype,
    acc.Name AS Category,
    coa.Name AS ChartOfAccounts,
    coa.AccountCode AS AccountCode,
    
    SUM(bud.Appropriation) AS Original,
    SUM(bud.TotalAmount) AS Final,
    SUM(bud.Appropriation) - SUM(bud.TotalAmount) AS Difference,
    SUM(ABS(bud.Charges)) AS Actual,
    SUM(bud.TotalAmount) - SUM(ABS(bud.Charges)) AS Difference2,

    -- Last day of the month for fsy.MonthEnd
    CASE 
      WHEN fsy.MonthEnd IN ('January', 'March', 'May', 'July', 'August', 'October', 'December')
      THEN fsy.MonthEnd + ' 31, ' + fsy.Year
      WHEN fsy.MonthEnd IN ('April', 'June', 'September', 'November')
      THEN fsy.MonthEnd + ' 30, ' + fsy.Year
      -- Simplistic leap year check from original, maintained for parity
      WHEN CAST(fsy.Year AS INT) % 4 <> 0
      THEN fsy.MonthEnd + ' 28, ' + fsy.Year
      ELSE fsy.MonthEnd + ' 29, ' + fsy.Year
    END AS Period,

    SUM(bud.Appropriation) AS Original_Sum,
    SUM(bud.TotalAmount) AS Final_Sum,
    SUM(bud.Appropriation) - SUM(bud.TotalAmount) AS Difference_Sum,
    SUM(ABS(bud.Charges)) AS Actual_Sum,
    SUM(bud.TotalAmount) - SUM(ABS(bud.Charges)) AS Difference2_Sum,

    lmu.Name AS Municipality,
    lpr.Name AS Province,

    @fiscalYear AS Extra

  FROM budget AS bud
    INNER JOIN chartofaccounts  AS coa ON coa.ID = bud.ChartOfAccountsID
    INNER JOIN accounttype      AS act ON act.ID = coa.AccountTypeID
    INNER JOIN accountsubtype   AS acs ON acs.ID = coa.AccountSubTypeID
    INNER JOIN accountcategory  AS acc ON acc.ID = coa.AccountCategoryID
    INNER JOIN fiscalyear       AS fsy ON fsy.ID = bud.FiscalYearID
    INNER JOIN lgu              AS lgu ON lgu.ID = 1
    INNER JOIN municipality     AS lmu ON lmu.ID = lgu.MunicipalityID
    INNER JOIN province         AS lpr ON lpr.ID = lgu.ProvinceID

  WHERE bud.FiscalYearID = @fiscalYear

  GROUP BY 
    act.Name,
    acs.ID,
    acs.Name,
    acc.Name,
    coa.Name,
    coa.AccountCode,
    CASE 
      WHEN fsy.MonthEnd IN ('January', 'March', 'May', 'July', 'August', 'October', 'December')
      THEN fsy.MonthEnd + ' 31, ' + fsy.Year
      WHEN fsy.MonthEnd IN ('April', 'June', 'September', 'November')
      THEN fsy.MonthEnd + ' 30, ' + fsy.Year
      WHEN CAST(fsy.Year AS INT) % 4 <> 0
      THEN fsy.MonthEnd + ' 28, ' + fsy.Year
      ELSE fsy.MonthEnd + ' 29, ' + fsy.Year
    END,
    lmu.Name,
    lpr.Name;
END
GO
