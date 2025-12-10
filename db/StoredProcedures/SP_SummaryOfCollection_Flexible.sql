DELIMITER $$

CREATE PROCEDURE SP_SummaryOfCollection_Flexible (
  IN in_startdate VARCHAR(50),
  IN in_enddate VARCHAR(50),
  IN in_user VARCHAR(50),
  IN in_note VARCHAR(50),
  IN in_ctc VARCHAR(50),
  IN in_btc VARCHAR(50),
  IN in_mrc VARCHAR(50),
  IN in_gsi VARCHAR(50),
  IN in_rpt VARCHAR(50),
  IN in_pmt VARCHAR(50)
)
BEGIN

  SELECT 
    UPPER(lmu.Name) AS Municipality,
    UPPER(lpr.Name) AS Province,
    in_startdate AS StartDate,
    in_enddate AS EndDate,
    trt.InvoiceDate,
    trt.InvoiceNumber,
    trt.CustomerName,
    trt.Total,
    CONCAT(pst.FirstName, ' ', LEFT(pst.MiddleName, 1), '. ', pst.LastName) AS Poster,
    CONCAT(prp.FirstName, ' ', LEFT(prp.MiddleName, 1), '. ', prp.LastName) AS Prepare,
    CONCAT(ntd.FirstName, ' ', LEFT(ntd.MiddleName, 1), '. ', ntd.LastName) AS Note,
    psp.Name AS PreparePosition,
    psn.Name AS NotedPosition

  FROM transactiontable AS trt
  INNER JOIN users AS usr ON usr.UserName = trt.CreatedBy
  INNER JOIN employee AS pst ON pst.ID = usr.EmployeeID
  INNER JOIN employee AS prp ON prp.ID = in_user
  INNER JOIN position AS psp ON psp.ID = prp.PositionID
  INNER JOIN employee AS ntd ON ntd.ID = in_note
  INNER JOIN position AS psn ON psn.ID = ntd.PositionID
  INNER JOIN lgu AS lgu ON lgu.ID = 1
  INNER JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
  INNER JOIN province AS lpr ON lpr.ID = lgu.ProvinceID

  WHERE trt.DocumentTypeID IN (in_ctc, in_gsi, in_rpt, in_btc, in_mrc, in_pmt)
    AND trt.InvoiceDate >= STR_TO_DATE(in_startdate, '%Y-%m-%d')
    AND trt.InvoiceDate <= STR_TO_DATE(in_enddate, '%Y-%m-%d')

  ORDER BY trt.InvoiceDate;

END$$

DELIMITER ;
