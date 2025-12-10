DELIMITER $$

CREATE PROCEDURE display_SAO (
    IN startDate VARCHAR(50),
    IN endDate VARCHAR(50),
    IN depID VARCHAR(50),
    IN fiscalID VARCHAR(50),
    IN fundID VARCHAR(50)
)
BEGIN
    SELECT 
        trt.InvoiceDate AS Date,
        trt.InvoiceNumber AS `OBR No.`,
        itm.Name AS Particulars,
        bud.TotalAmount AS `Appropriation / Allotment`,
        tri.Price AS Expenses,
        bud.Released AS Balance
    FROM transactiontable AS trt
    INNER JOIN transactionitems AS tri ON tri.LinkID = trt.LinkID
    INNER JOIN item AS itm ON itm.ID = tri.ItemID
    INNER JOIN budget AS bud 
        ON bud.ChartOfAccountsID = tri.ChargeAccountID 
        AND bud.DepartmentID = depID 
        AND bud.FiscalYearID = fiscalID
    INNER JOIN funds AS fnd ON fnd.ID = trt.FundsID
    INNER JOIN department AS dep ON dep.ID = depID
    INNER JOIN lgu AS lgu ON lgu.ID = 1
    INNER JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    WHERE trt.DocumentTypeID = 13
        AND trt.ResponsibilityCenter = depID
        AND trt.Status LIKE '%Posted%'
        AND trt.InvoiceDate >= startDate
        AND trt.InvoiceDate < endDate;
END$$

DELIMITER ;
