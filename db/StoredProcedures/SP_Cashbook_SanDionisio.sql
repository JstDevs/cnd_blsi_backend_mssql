DELIMITER $$

CREATE PROCEDURE SP_Cashbook_SanDionisio (
    IN startDate VARCHAR(50),
    IN endDate VARCHAR(50),
    IN fundID VARCHAR(50),
    IN userID VARCHAR(50)
)
BEGIN
    SELECT 
        YEAR(STR_TO_DATE(startDate, '%Y-%m-%d')) AS Year,
        CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName) AS Officer,
        CASE 
            WHEN fundID = '%' THEN 'All Funds'
            ELSE fnd.Name
        END AS Fund,
        trt.InvoiceDate,
        trt.APAR,
        trt.InvoiceNumber,
        trt.Debit,
        trt.Credit,
        trt.Debit AS Balance
    FROM transactiontable AS trt
    INNER JOIN funds AS fnd ON fnd.ID LIKE fundID
    INNER JOIN employee AS emp ON emp.ID = userID
    INNER JOIN users AS usr ON usr.EmployeeID = emp.ID AND usr.UserName = trt.CreatedBy
    WHERE trt.DocumentTypeID IN (5, 6, 11, 18, 19)
      AND trt.InvoiceDate >= STR_TO_DATE(startDate, '%Y-%m-%d')
      AND trt.InvoiceDate <= STR_TO_DATE(endDate, '%Y-%m-%d');
END$$

DELIMITER ;
