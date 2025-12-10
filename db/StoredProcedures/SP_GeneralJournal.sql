DELIMITER $$

CREATE PROCEDURE SP_GeneralJournal (
    IN startDate VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    IN endDate VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    IN fundID VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    IN code VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
)
BEGIN

    SELECT 
        UPPER(lmu.Name) AS Municipality,
        CASE
            WHEN fundID = '%' THEN 'AllFunds'
            ELSE glg.FundName
        END AS Funds,
        startDate AS StartDate,
        endDate AS EndDate,
        trt.InvoiceDate,
        trt.InvoiceNumber,
        trt.Remarks,
        REPLACE(glg.AccountCode, '-', '') AS AccountCode,
        'S/L' AS SL,
        glg.Debit,
        glg.Credit,
        CONCAT(apr.FirstName, ' ', LEFT(apr.MiddleName, 1), '. ', apr.LastName) AS Approver,
        pos.Name AS Position,
        MAX(apa.ApprovalOrder) AS a
    FROM transactiontable AS trt
    INNER JOIN generalledger AS glg ON glg.LinkID = trt.LinkID
    LEFT JOIN approvalaudit AS apa ON apa.InvoiceLink = trt.LinkID
    LEFT JOIN employee AS apr ON apr.ID = apa.PositionOrEmployeeID
    LEFT JOIN position AS pos ON pos.ID = apr.PositionID
    INNER JOIN lgu AS lgu ON lgu.ID = 1
    INNER JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    WHERE 
        (trt.APAR = 'Journal Entry Voucher' OR trt.APAR = 'Disbursement Voucher')
        AND trt.InvoiceDate >= startDate
        AND trt.InvoiceDate <= endDate
        AND CONCAT(glg.FundID, '') COLLATE utf8mb4_general_ci LIKE fundID COLLATE utf8mb4_general_ci
        AND apa.SequenceOrder = 0
        AND glg.AccountCode LIKE code
    GROUP BY 
        CASE WHEN fundID = '%' THEN 'AllFunds' ELSE glg.FundName END,
        glg.FundName,
        trt.InvoiceDate,
        trt.InvoiceNumber,
        trt.Remarks,
        glg.AccountCode,
        glg.Debit,
        glg.Credit,
        apr.FirstName,
        apr.MiddleName,
        apr.LastName,
        pos.Name,
        lmu.Name,
        trt.LinkID
    ORDER BY 
        trt.LinkID, trt.InvoiceDate ASC, glg.Debit DESC;

END $$

DELIMITER ;
