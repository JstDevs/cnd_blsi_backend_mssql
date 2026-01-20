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
        console.log(`[validateApproval] Next Level Needed: ${nextSequenceInt}`);

        // 4. Check authorization
        const isAuthorized = nextRule.Approvers.some(appr => {
            const type = appr.PositionorEmployee;
            const targetID = parseInt(appr.PositionorEmployeeID);

            console.log(`[validateApproval] Rule Seq ${nextSequenceInt}: Checking ${type} ID ${targetID} against User (Pos:${positionID}, Emp:${employeeID}, Roles:${userAccessIDs})`);

            if (type === 'Position') return targetID === positionID;
            if (type === 'Employee') return targetID === employeeID;
            if (type === 'Role') return userAccessIDs.includes(targetID);
            return false;
        });

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

        const totalApproversNeeded = nextRule.NumberofApprover || 1;
        const ruleType = nextRule.AllorMajority;
        const newApprovalCount = approvalsInCurrentLevel + 1;

        let isSequenceSatisfied = false;
        if (ruleType === 'Majority') {
            isSequenceSatisfied = newApprovalCount >= Math.ceil((totalApproversNeeded + 1) / 2);
        } else {
            isSequenceSatisfied = newApprovalCount >= totalApproversNeeded;
        }

        // 7. Finality
        const remainingRules = matrixRules.filter(r => parseInt(r.SequenceLevel) > nextSequenceInt);
        const isFinal = isSequenceSatisfied && remainingRules.length === 0;

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
