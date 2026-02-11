const db = require('../config/database');
const { Op } = require('sequelize');

async function validateApproval({ documentTypeID, approvalVersion, totalAmount, transactionLinkID, user }) {
    if (!user) throw new Error('User information is required for approval validation.');

    try {
        // Ensure values from user object are parsed to numbers
        const employeeID = parseInt(user.employeeID);
        const userAccessIDs = (user.userAccessIDs || []).map(id => parseInt(id));

        // 1. Fetch user position
        const employee = await db.employee.findByPk(employeeID);
        const positionID = employee ? parseInt(employee.PositionID) : null;

        // 2. Fetch current sequence
        const lastAudit = await db.ApprovalAudit.findOne({
            where: { InvoiceLink: transactionLinkID },
            order: [['SequenceOrder', 'DESC']],
        });

        const currentSequence = lastAudit ? parseInt(lastAudit.SequenceOrder) : 0;

        console.log(`[validateApproval] Transaction: ${transactionLinkID}, CurrentSeq: ${currentSequence}, UserID: ${employeeID}, PosID: ${positionID}`);

        // 3. Fetch matrix rules
        const matrixRules = await db.ApprovalMatrix.findAll({
            where: {
                DocumentTypeID: documentTypeID,
                Version: approvalVersion,
                Active: true
            },
            include: [{
                model: db.Approvers,
                as: 'Approvers',
                where: {
                    [Op.or]: [
                        {
                            AmountFrom: { [Op.lte]: totalAmount },
                            AmountTo: { [Op.gte]: totalAmount }
                        },
                        {
                            AmountFrom: { [Op.lte]: totalAmount },
                            AmountTo: 0
                        },
                        {
                            AmountFrom: 0,
                            AmountTo: 0
                        }
                    ]
                },
                required: true
            }]
        });

        matrixRules.sort((a, b) => (parseInt(a.SequenceLevel) || 0) - (parseInt(b.SequenceLevel) || 0));

        if (matrixRules.length === 0) {
            console.log(`[validateApproval] no rules for DocID:${documentTypeID} Version:${approvalVersion}`);
            return { canApprove: true, isFinal: true, nextStatus: 'Posted', nextSequence: 0, currentSequence: 0, numberOfApprovers: 0 };
        }

        const nextRule = matrixRules.find(r => parseInt(r.SequenceLevel) > currentSequence);

        if (!nextRule) {
            console.log('[validateApproval] All levels approved.');
            return { canApprove: false, error: 'Transaction is already fully approved for your amount bracket.' };
        }

        const nextSequenceInt = parseInt(nextRule.SequenceLevel);

        // Fetch ALL rules for this sequence level (in case of split approvals)
        const currentLevelRules = matrixRules.filter(r => parseInt(r.SequenceLevel) === nextSequenceInt);

        console.log(`[validateApproval] Next Level Needed: ${nextSequenceInt}, Rules Found: ${currentLevelRules.length}`);

        // 4. Check authorization (against ANY of the rules for this level)
        let isAuthorized = false;

        for (const rule of currentLevelRules) {
            const authorizedInRule = rule.Approvers.some(appr => {
                const type = appr.PositionorEmployee;
                const targetID = parseInt(appr.PositionorEmployeeID);

                // console.log(`[validateApproval] Rule Seq ${nextSequenceInt} (RuleID ${rule.ID}): Checking ${type} ID ${targetID} against User`);

                if (type === 'Position') return targetID === positionID;
                if (type === 'Employee') return targetID === employeeID;
                if (type === 'Role') return userAccessIDs.includes(targetID);
                return false;
            });

            if (authorizedInRule) {
                isAuthorized = true;
                break;
            }
        }

        if (!isAuthorized) {
            console.log(`[validateApproval] DENIED: User not in authorized list for Seq ${nextSequenceInt}`);
            return {
                canApprove: false,
                error: `Access Denied: You are not an authorized approver for Sequence Level ${nextRule.SequenceLevel}.`
            };
        }

        // 5. Check duplicate
        const alreadyApproved = await db.ApprovalAudit.findOne({
            where: {
                InvoiceLink: transactionLinkID,
                SequenceOrder: nextSequenceInt,
                PositionorEmployeeID: employeeID
            }
        });

        if (alreadyApproved) {
            console.log('[validateApproval] DENIED: Already approved by this user.');
            return { canApprove: false, error: 'You have already approved this sequence level.' };
        }

        // 6. Check satisfaction
        const approvalsInCurrentLevel = await db.ApprovalAudit.count({
            where: {
                InvoiceLink: transactionLinkID,
                SequenceOrder: nextSequenceInt
            }
        });

        // Calculate Total Needed for this Level
        // If multiple rules exist for same level, we SUM their requirements (assuming split responsibility)
        // Adjust this logic if the requirement is different (e.g. MAX)
        let totalApproversNeeded = 0;
        let ruleType = 'All'; // Default

        if (currentLevelRules.length > 0) {
            totalApproversNeeded = currentLevelRules.reduce((sum, r) => sum + (r.NumberofApprover || 1), 0);
            ruleType = currentLevelRules[0].AllorMajority; // Take from first rule
        } else {
            totalApproversNeeded = nextRule.NumberofApprover || 1;
            ruleType = nextRule.AllorMajority;
        }

        const newApprovalCount = approvalsInCurrentLevel + 1;

        let isSequenceSatisfied = false;
        if (ruleType === 'Majority') {
            isSequenceSatisfied = newApprovalCount >= Math.ceil((totalApproversNeeded + 1) / 2);
        } else {
            isSequenceSatisfied = newApprovalCount >= totalApproversNeeded;
        }

        console.log(`[validateApproval] Level ${nextSequenceInt}: Has ${newApprovalCount}/${totalApproversNeeded} approvals. Satisfied: ${isSequenceSatisfied}`);

        // 7. Finality
        // Check if there are any levels AFTER this one
        const higherLevels = matrixRules.filter(r => parseInt(r.SequenceLevel) > nextSequenceInt);
        const isFinal = isSequenceSatisfied && higherLevels.length === 0;

        return {
            canApprove: true,
            isFinal: isFinal,
            nextStatus: isFinal ? 'Posted' : 'Requested',
            nextSequence: isSequenceSatisfied ? nextSequenceInt : currentSequence,
            currentSequence: nextSequenceInt,
            numberOfApprovers: totalApproversNeeded
        };

    } catch (error) {
        console.error('[validateApproval] Error:', error);
        throw error;
    }
}

module.exports = validateApproval;
