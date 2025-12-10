DELIMITER $$

CREATE PROCEDURE SP_ComparisonFSP (
    IN p_Date VARCHAR(50),
    IN p_Notes TEXT
)
BEGIN
    CREATE TEMPORARY TABLE TempFS (
        Type_ VARCHAR(50),
        Term VARCHAR(50),
        SubType VARCHAR(50),
        Notes VARCHAR(50),
        Values_ DECIMAL(18,2),
        Comparison DECIMAL(18,2),
        RowNum INT
    );

    CREATE TEMPORARY TABLE NotesTable (
        NoteValue TEXT,
        RowNum INT
    );

    INSERT INTO NotesTable (NoteValue, RowNum)
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_Notes, ',', numbers.n), ',', -1)) AS NoteValue, numbers.n AS RowNum
    FROM (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (
            SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) a,
        (
            SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) b
    ) numbers
    WHERE numbers.n <= 1 + LENGTH(p_Notes) - LENGTH(REPLACE(p_Notes, ',', ''));

    -- ConsolidatedWithComparison
    CREATE TEMPORARY TABLE ConsolidatedWithComparison AS
    SELECT e.Name AS Type_,
           'Current' AS Term,
           d.Name AS SubType,
           NULL AS Values_,
           SUM(a.Debit) - SUM(a.Credit) AS Comparison
    FROM generalledger a
    INNER JOIN chartofaccounts b ON a.AccountCode = b.AccountCode
    INNER JOIN accountcategory c ON b.AccountCategoryID = c.ID
    RIGHT JOIN accountsubtype d ON c.AccountSubTypeID = d.ID
    INNER JOIN accounttype e ON d.AccountTypeID = e.ID
    WHERE d.Active = 1 AND e.ID IN (1,2,4)
      AND d.ID IN (7,8,9,10,11,16,17,18,19,20)
      AND YEAR(a.CreatedDate) = YEAR(CURDATE())
    GROUP BY e.Name, d.Name

    UNION ALL

    SELECT e.Name, 'Non-Current', d.Name, NULL, SUM(a.Debit) - SUM(a.Credit)
    FROM generalledger a
    INNER JOIN chartofaccounts b ON a.AccountCode = b.AccountCode
    INNER JOIN accountcategory c ON b.AccountCategoryID = c.ID
    RIGHT JOIN accountsubtype d ON c.AccountSubTypeID = d.ID
    INNER JOIN accounttype e ON d.AccountTypeID = e.ID
    WHERE d.Active = 1 AND e.ID IN (1,2,4)
      AND d.ID IN (8,9,12,13,14,15,16,17,18,19,20)
      AND YEAR(a.CreatedDate) < YEAR(CURDATE())
    GROUP BY e.Name, d.Name

    UNION ALL

    SELECT 'Equity', NULL, 'Total Equity', NULL, SUM(a.Debit) - SUM(a.Credit)
    FROM generalledger a
    INNER JOIN chartofaccounts b ON a.AccountCode = b.AccountCode
    WHERE b.AccountTypeID = 4
      AND YEAR(a.CreatedDate) = '2023'
    GROUP BY YEAR(a.CreatedDate)

    UNION ALL

    SELECT e.Name, 'Current', d.Name, SUM(a.Debit) - SUM(a.Credit), NULL
    FROM generalledger a
    INNER JOIN chartofaccounts b ON a.AccountCode = b.AccountCode
    INNER JOIN accountcategory c ON b.AccountCategoryID = c.ID
    RIGHT JOIN accountsubtype d ON c.AccountSubTypeID = d.ID
    INNER JOIN accounttype e ON d.AccountTypeID = e.ID
    WHERE d.Active = 1 AND e.ID IN (1,2,4)
      AND d.ID IN (7,8,9,10,11,16,17,18,19,20)
      AND YEAR(a.CreatedDate) = YEAR(CURDATE())
    GROUP BY e.Name, d.Name

    UNION ALL

    SELECT e.Name, 'Non-Current', d.Name, SUM(a.Debit) - SUM(a.Credit), NULL
    FROM generalledger a
    INNER JOIN chartofaccounts b ON a.AccountCode = b.AccountCode
    INNER JOIN accountcategory c ON b.AccountCategoryID = c.ID
    RIGHT JOIN accountsubtype d ON c.AccountSubTypeID = d.ID
    INNER JOIN accounttype e ON d.AccountTypeID = e.ID
    WHERE d.Active = 1 AND e.ID IN (1,2,4)
      AND d.ID IN (8,9,12,13,14,15,16,17,18,19,20)
      AND YEAR(a.CreatedDate) < YEAR(CURDATE())
    GROUP BY e.Name, d.Name

    UNION ALL

    SELECT 'Equity', NULL, 'Total Equity', SUM(a.Debit) - SUM(a.Credit), NULL
    FROM generalledger a
    INNER JOIN chartofaccounts b ON a.AccountCode = b.AccountCode
    WHERE b.AccountTypeID = 4
      AND YEAR(a.CreatedDate) = YEAR(CURDATE());

    -- Insert to TempFS
    INSERT INTO TempFS (Type_, Term, SubType, Notes, Values_, Comparison, RowNum)
    SELECT
        Type_,
        Term,
        SubType,
        '' AS Notes,
        COALESCE(MAX(Values_), MIN(Values_)),
        COALESCE(MAX(Comparison), MIN(Comparison)),
        ROW_NUMBER() OVER (ORDER BY Type_, Term, SubType) AS RowNum
    FROM ConsolidatedWithComparison
    GROUP BY Type_, Term, SubType;

    -- Update notes
    UPDATE TempFS T
    JOIN NotesTable NT ON T.RowNum = NT.RowNum
    SET T.Notes = NT.NoteValue;

    -- Final output
    SELECT Type_ AS Type, Term, SubType, Notes, Values_, Comparison
    FROM TempFS
    GROUP BY Type_, Term, SubType, Notes, Values_, Comparison;

    -- Cleanup
    DROP TEMPORARY TABLE IF EXISTS TempFS;
    DROP TEMPORARY TABLE IF EXISTS NotesTable;
    DROP TEMPORARY TABLE IF EXISTS ConsolidatedWithComparison;
END $$

DELIMITER ;
