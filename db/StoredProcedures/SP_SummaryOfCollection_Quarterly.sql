DELIMITER $$

CREATE PROCEDURE SP_SummaryOfCollection_Quarterly (
  IN in_quarter VARCHAR(50),
  IN in_year VARCHAR(50),
  IN in_user VARCHAR(50),
  IN in_ctc VARCHAR(50),
  IN in_btc VARCHAR(50),
  IN in_mrc VARCHAR(50),
  IN in_gsi VARCHAR(50),
  IN in_rpt VARCHAR(50),
  IN in_pmt VARCHAR(50)
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
    CONCAT(UCASE(fnd.Name), ': ') AS FundName,
    
    CASE
      WHEN trt.DocumentTypeID = 5 THEN 'Community Tax'
      WHEN trt.DocumentTypeID = 18 THEN 'Verification and Authentication Fees - Burial'
      WHEN trt.DocumentTypeID = 19 THEN 'Verification and Authentication Fees - Marriage'
      WHEN trt.DocumentTypeID = 11 THEN 'Real Property Tax'
      WHEN trt.DocumentTypeID = 30 THEN 'Receipts from Market Operation'
      WHEN trt.DocumentTypeID = 6 THEN coa.Name
      ELSE 'Error'
    END AS ChartOfAccounts,

    0 AS Total,
    AVG(qrt.Total2) AS FirstQuarter,
    AVG(qrt.Total3) AS SecondQuarter,
    AVG(qrt.Total4) AS ThirdQuarter,
    in_year AS Year,

    CASE in_quarter
      WHEN '1' THEN '1st Qtr'
      WHEN '2' THEN '2nd Qtr'
      WHEN '3' THEN '3rd Qtr'
      WHEN '4' THEN '4th Qtr'
    END AS Quarter,

    CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName) AS FullName,
    pos.Name AS Position,

    STR_TO_DATE(CONCAT(in_year, '-', ((CAST(in_quarter AS UNSIGNED) - 1) * 3 + 1), '-01'), '%Y-%m-%d') AS First,
    STR_TO_DATE(CONCAT(in_year, '-', ((CAST(in_quarter AS UNSIGNED) - 1) * 3 + 2), '-01'), '%Y-%m-%d') AS Second,
    STR_TO_DATE(CONCAT(in_year, '-', ((CAST(in_quarter AS UNSIGNED) - 1) * 3 + 3), '-01'), '%Y-%m-%d') AS Third

  FROM transactiontable AS trt
  LEFT JOIN funds AS fnd ON fnd.ID = trt.FundsID
  LEFT JOIN transactionitems AS tri ON tri.LinkID = trt.LinkID
  LEFT JOIN chartofaccounts AS coa ON coa.ID = tri.ChargeAccountID
  LEFT JOIN users AS usr ON usr.ID = in_user
  INNER JOIN employee AS emp ON emp.ID = usr.EmployeeID
  INNER JOIN position AS pos ON pos.ID = emp.PositionID
  LEFT JOIN (
    SELECT 
      trt.FundsID,
      trt.DocumentTypeID,
      CASE
        WHEN trt.DocumentTypeID = 5 THEN 334
        WHEN trt.DocumentTypeID IN (18, 19) THEN 364
        WHEN trt.DocumentTypeID = 11 THEN 335
        WHEN trt.DocumentTypeID = 30 THEN 383
        WHEN trt.DocumentTypeID = 6 THEN tri.ChargeAccountID
        ELSE 'Error'
      END AS ChargeAccountID,
      
      CASE
        WHEN trt.DocumentTypeID = 6 THEN SUM(tri.Sub_Total)
        ELSE SUM(trt.Total)
      END AS MainTotal,
      
      CASE
        WHEN trt.InvoiceDate >= '2025-01-01' AND trt.InvoiceDate < '2025-02-01' THEN
          CASE
            WHEN trt.DocumentTypeID = 6 THEN SUM(tri.Sub_Total)
            ELSE SUM(trt.Total)
          END
        ELSE NULL
      END AS Total2,

      CASE
        WHEN trt.InvoiceDate >= '2025-02-01' AND trt.InvoiceDate < '2025-03-01' THEN
          CASE
            WHEN trt.DocumentTypeID = 6 THEN SUM(tri.Sub_Total)
            ELSE SUM(trt.Total)
          END
        ELSE NULL
      END AS Total3,

      CASE
        WHEN trt.InvoiceDate >= '2025-03-01' AND trt.InvoiceDate < '2025-04-01' THEN
          CASE
            WHEN trt.DocumentTypeID = 6 THEN SUM(tri.Sub_Total)
            ELSE SUM(trt.Total)
          END
        ELSE NULL
      END AS Total4

    FROM transactiontable AS trt
    LEFT JOIN transactionitems AS tri ON tri.LinkID = trt.LinkID
    WHERE trt.DocumentTypeID IN (in_ctc, in_gsi, in_rpt, in_btc, in_mrc, in_pmt)
    GROUP BY trt.FundsID, trt.DocumentTypeID, tri.ChargeAccountID, trt.InvoiceDate
  ) AS qrt ON (
    (qrt.FundsID = trt.FundsID AND qrt.ChargeAccountID = tri.ChargeAccountID)
    OR (qrt.DocumentTypeID = trt.DocumentTypeID AND qrt.FundsID = trt.FundsID AND qrt.DocumentTypeID <> 6)
  )
  WHERE trt.DocumentTypeID IN (in_ctc, in_gsi, in_rpt, in_btc, in_mrc, in_pmt)
    AND NOT (trt.DocumentTypeID = in_gsi AND tri.ChargeAccountID IS NULL)
    AND trt.FundsID <> 0

  GROUP BY tri.ChargeAccountID, trt.DocumentTypeID, trt.FundsID, fnd.Name, coa.Name,
           emp.FirstName, emp.MiddleName, emp.LastName, pos.Name

  ORDER BY trt.FundsID, coa.Name;

END$$

DELIMITER ;
