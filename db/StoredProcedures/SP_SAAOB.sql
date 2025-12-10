DELIMITER $$

CREATE PROCEDURE SP_SAAOB (
    IN startDate VARCHAR(50),
    IN endDate VARCHAR(50),
    IN fiscalYear VARCHAR(50),
    IN fundID VARCHAR(50),
    IN userID VARCHAR(50)
)
BEGIN
    SELECT 
        CASE 
            WHEN fundID = '%' THEN 'All Funds'
            ELSE fnd.Name
        END AS Fund,
        endDate AS Year,
        fsy.MonthEnd,
        REPLACE(coa.AccountCode, '-', '') AS AccountCode,
        acc.ID,
        UPPER(acc.Name) AS Category,
        bud.Name,
        IFNULL(SUM(bud.Appropriation + bud.Supplemental + bud.Transfer), 0) AS Appropriation,
        IFNULL(SUM(bud.Released), 0) AS Allotment,
        IFNULL(SUM(bud.Charges), 0) AS Obligation,
        IFNULL(SUM(bud.Appropriation + bud.Supplemental + bud.Transfer) - SUM(bud.Released), 0) AS UnobligatedAppropriation,
        IFNULL(SUM(bud.Released) - SUM(bud.Charges), 0) AS UnobligatedAllotment,
        UPPER(lmu.Name) AS Municipality,
        lpr.Name AS Province,
        CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName) AS RequestedBy,
        pos.Name AS Position
    FROM budget AS bud
    INNER JOIN chartofaccounts AS coa ON coa.ID = bud.ChartofAccountsID
    INNER JOIN accountcategory AS acc ON acc.ID = coa.AccountCategoryID
    INNER JOIN funds AS fnd ON fnd.ID = bud.FundID
    INNER JOIN fiscalyear AS fsy ON fsy.ID = bud.FiscalYearID
    INNER JOIN lgu AS lgu ON lgu.ID = 1
    INNER JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    INNER JOIN province AS lpr ON lpr.ID = lgu.ProvinceID
    INNER JOIN employee AS emp ON emp.ID = userID
    INNER JOIN position AS pos ON pos.ID = emp.PositionID
    WHERE bud.FiscalYearID = fiscalYear
        AND bud.CreatedDate >= startDate
        AND bud.CreatedDate <= endDate
        AND CONCAT(bud.FundID, '') LIKE fundID
        AND coa.AccountTypeID = 5
    GROUP BY 
        fnd.Name,
        fsy.Year,
        fsy.MonthEnd,
        bud.Name,
        lmu.Name,
        lpr.Name,
        coa.AccountCode,
        acc.ID,
        acc.Name,
        emp.FirstName,
        emp.MiddleName,
        emp.LastName,
        pos.Name,
        bud.ChartofAccountsID
    ORDER BY bud.ChartofAccountsID;

END$$

DELIMITER ;
