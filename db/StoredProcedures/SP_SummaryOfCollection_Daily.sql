DELIMITER $$

CREATE PROCEDURE SP_SummaryOfCollection_Daily (
    IN p_date VARCHAR(50),
    IN p_user VARCHAR(50),
    IN p_ctc VARCHAR(50),
    IN p_btc VARCHAR(50),
    IN p_mrc VARCHAR(50),
    IN p_gsi VARCHAR(50),
    IN p_rpt VARCHAR(50),
    IN p_pmt VARCHAR(50)
)
BEGIN
    SELECT 
        CASE
            WHEN trt.DocumentTypeID = 5 THEN 334
            WHEN trt.DocumentTypeID IN (18, 19) THEN 364
            WHEN trt.DocumentTypeID = 11 THEN 335
            WHEN trt.DocumentTypeID = 30 THEN 383
            WHEN trt.DocumentTypeID = 6 THEN tri.ChargeAccountID
            ELSE 'Error'
        END AS ChargeAccountID,

        trt.FundsID,
        fnd.Name,

        CASE
            WHEN trt.DocumentTypeID = 5 THEN 'Community Tax'
            WHEN trt.DocumentTypeID = 18 THEN 'Verification and Authentication Fees - Burial'
            WHEN trt.DocumentTypeID = 18 THEN 'Verification and Authentication Fees - Marriage'
            WHEN trt.DocumentTypeID = 11 THEN 'Real Property Tax'
            WHEN trt.DocumentTypeID = 30 THEN 'Receipts from Market Operation'
            WHEN trt.DocumentTypeID = 6 THEN coa.Name
            ELSE 'Error'
        END AS Account,

        CASE
            WHEN trt.DocumentTypeID = 6 THEN SUM(tri.Sub_Total)
            ELSE SUM(trt.Total)
        END AS SubTotal,

        STR_TO_DATE(p_date, '%Y-%m-%d') AS Date,

        CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName) AS FullName,
        pos.Name AS Position

    FROM transactiontable AS trt
    LEFT JOIN funds AS fnd ON fnd.ID = trt.FundsID
    LEFT JOIN transactionitems AS tri ON tri.LinkID = trt.LinkID
    LEFT JOIN chartofaccounts AS coa ON coa.ID = tri.ChargeAccountID
    LEFT JOIN users AS usr ON usr.ID = p_user
    INNER JOIN employee AS emp ON emp.ID = usr.EmployeeID
    INNER JOIN position AS pos ON pos.ID = emp.PositionID

    WHERE trt.DocumentTypeID IN (p_ctc, p_gsi, p_rpt, p_btc, p_mrc, p_pmt)
      AND NOT (trt.DocumentTypeID = p_gsi AND tri.ChargeAccountID IS NULL)
      AND trt.InvoiceDate = STR_TO_DATE(p_date, '%Y-%m-%d')

    GROUP BY 
        tri.ChargeAccountID,
        trt.DocumentTypeID,
        trt.FundsID,
        fnd.Name,
        coa.Name,
        emp.FirstName,
        emp.MiddleName,
        emp.LastName,
        pos.Name

    ORDER BY 
        trt.FundsID,
        coa.Name;
END$$

DELIMITER ;
