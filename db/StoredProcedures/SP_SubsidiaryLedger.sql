SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('[dbo].[SP_SubsidiaryLedger]', 'P') IS NOT NULL
DROP PROCEDURE [dbo].[SP_SubsidiaryLedger]
GO

CREATE PROCEDURE [dbo].[SP_SubsidiaryLedger] (
    @accountCode VARCHAR(50),
    @fundID VARCHAR(50),
    @cutoff VARCHAR(50)
)
AS
BEGIN
    SELECT 
        gle.ID AS id,
        fnd.Name AS fund,
        gle.AccountName AS account_name,
        gle.AccountCode AS account_code,
        CAST(gle.CreatedDate AS DATE) AS date,
        gle.LedgerItem AS ledger_item,
        CASE
            WHEN ISNULL(gle.Debit, 0) = 0.00 THEN NULL
            ELSE gle.Debit
        END AS debit,
        CASE
            WHEN ISNULL(gle.Credit, 0) = 0.00 THEN NULL
            ELSE gle.Credit
        END AS credit,
        SUM(ISNULL(gle.Debit, 0) - ISNULL(gle.Credit, 0)) OVER (ORDER BY gle.CreatedDate, gle.ID) AS balance,
        lmu.Name AS municipality
    FROM generalledger AS gle
    INNER JOIN funds AS fnd ON fnd.ID = gle.FundID
    LEFT JOIN lgu AS lgu ON lgu.ID = 1
    LEFT JOIN municipality AS lmu ON lmu.ID = lgu.MunicipalityID
    WHERE (gle.AccountCode LIKE @accountCode OR @accountCode = '%')
      AND (CAST(gle.FundID AS VARCHAR) LIKE @fundID OR @fundID = '%')
      AND CAST(gle.CreatedDate AS DATE) <= CAST(@cutoff AS DATE);
END
GO
