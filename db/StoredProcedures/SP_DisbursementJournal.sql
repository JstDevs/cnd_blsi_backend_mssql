DELIMITER $$

CREATE PROCEDURE SP_DisbursementJournal (
  IN in_modeOfPayment VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  IN in_startDate VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  IN in_endDate VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  IN in_fundID VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  IN in_code VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
)
BEGIN

  SELECT 
    UPPER(lmu.Name) AS Municipality,

    CASE
      WHEN in_fundID = '%' THEN 'All Funds'
      ELSE gli.FundName
    END AS Funds,

    MAX(apa.ApprovalDate) AS Date,
    trt.CheckNumber AS CheckNo,
    trt.InvoiceNumber AS VoucherNo,
    trt.InvoiceNumber AS JEVNo,

    CASE
      WHEN trt.VendorID IS NOT NULL THEN CONCAT(ven.Name, ' / ')
      WHEN trt.EmployeeID IS NOT NULL THEN CONCAT(emp.FirstName, ' ', LEFT(emp.MiddleName, 1), '. ', emp.LastName, ' / ')
    END AS Claimant,

    GROUP_CONCAT(DISTINCT ite.Name SEPARATOR ', ') AS Particulars,

    REPLACE(gli.AccountCode, '-', '') AS AccountCode,

    CASE WHEN gli.Debit = 0.00 THEN NULL ELSE gli.Debit END AS Debit,
    CASE WHEN gli.Credit = 0.00 THEN NULL ELSE gli.Credit END AS Credit,

    CONCAT(apr.FirstName, ' ', LEFT(apr.MiddleName, 1), '. ', apr.LastName) AS Approver,
    pos.Name AS Position,

    in_startDate AS StartDate,
    in_endDate AS EndDate,

    MAX(apa.ApprovalOrder) AS a

  FROM `transactiontable` AS trt
  LEFT JOIN `generalledger` AS gli ON gli.LinkID = trt.LinkID
  LEFT JOIN `chartofaccounts` AS coa ON coa.AccountCode = gli.AccountCode
  LEFT JOIN `transactionitems` AS tri ON tri.LinkID = trt.LinkID
  INNER JOIN item AS itm ON itm.ID = tri.ItemID
  LEFT JOIN item AS ite ON ite.ID = itm.ID
  LEFT JOIN vendor AS ven ON ven.ID = trt.VendorID
  LEFT JOIN employee AS emp ON emp.ID = trt.EmployeeID
  LEFT JOIN `approvalaudit` AS apa ON apa.SequenceOrder = 0 AND apa.InvoiceLink = trt.LinkID
  LEFT JOIN employee AS apr ON apr.ID = apa.PositionOrEmployeeID
  LEFT JOIN position AS pos ON pos.ID = apr.PositionID
  INNER JOIN lgu AS lgu ON lgu.ID = 1
  INNER JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID

  WHERE trt.APAR = 'Disbursement Voucher'
    AND trt.ModeOfPayment = in_modeOfPayment
    AND apa.ApprovalDate >= STR_TO_DATE(in_startDate, '%Y-%m-%d')
    AND apa.ApprovalDate <= STR_TO_DATE(in_endDate, '%Y-%m-%d')
    AND gli.AccountCode LIKE in_code
    AND trt.FundsID LIKE in_fundID

  GROUP BY 
    CASE
      WHEN in_fundID = '%' THEN 'All Funds'
      ELSE gli.FundName
    END,
    gli.FundName,
    trt.CheckNumber,
    trt.InvoiceNumber,
    Claimant,
    itm.ID,
    gli.AccountCode,
    gli.AccountName,
    gli.Debit,
    gli.Credit,
    apr.FirstName,
    apr.MiddleName,
    apr.LastName,
    pos.Name,
    lmu.Name

  ORDER BY MAX(apa.ApprovalDate);

END$$

DELIMITER ;
