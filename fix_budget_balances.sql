-- Fix Appropriation Balance and Allotment Balance for all existing budget records
-- This script recalculates the balances using the correct formulas

-- Correct formulas:
-- AppropriationBalance = (Appropriation + Supplemental + Transfer) - Released
-- AllotmentBalance = Released - Charges

UPDATE budget
SET 
    AppropriationBalance = (
        ISNULL(Appropriation, 0) + 
        ISNULL(Supplemental, 0) + 
        ISNULL(Transfer, 0)
    ) - ISNULL(Released, 0),
    
    AllotmentBalance = ISNULL(Released, 0) - ISNULL(Charges, 0),
    
    ModifyDate = GETDATE()
WHERE 
    Active = 1;

-- Display the updated records to verify
SELECT 
    ID,
    Name,
    Appropriation,
    Supplemental,
    Transfer,
    Released,
    Charges,
    AppropriationBalance,
    AllotmentBalance,
    (ISNULL(Appropriation, 0) + ISNULL(Supplemental, 0) + ISNULL(Transfer, 0)) AS TotalBudget,
    (ISNULL(Appropriation, 0) + ISNULL(Supplemental, 0) + ISNULL(Transfer, 0)) - ISNULL(Released, 0) AS CalculatedAppropriationBalance,
    ISNULL(Released, 0) - ISNULL(Charges, 0) AS CalculatedAllotmentBalance
FROM budget
WHERE Active = 1
ORDER BY Name;
