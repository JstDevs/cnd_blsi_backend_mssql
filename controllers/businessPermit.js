const { BusinessPermit, ApprovalAudit, sequelize } = require('../config/database'); // Adjust path as needed
const db = require('../config/database');

// Get all Business Permits
exports.getAll = async (req, res) => {
    try {
        const permits = await BusinessPermit.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(permits);
    } catch (error) {
        console.error('Error fetching business permits:', error);
        res.status(500).json({ message: 'Failed to fetch business permits', error: error.message });
    }
};

// Get Single Business Permit by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const permit = await BusinessPermit.findByPk(id);

        if (!permit) {
            return res.status(404).json({ message: 'Business permit not found' });
        }

        res.status(200).json(permit);
    } catch (error) {
        console.error('Error fetching business permit:', error);
        res.status(500).json({ message: 'Failed to fetch business permit', error: error.message });
    }
};

// Create a new Business Permit
exports.create = async (req, res) => {
    const t = await sequelize.transaction();

    const docID = 42;
    let statusValue = '';
    const matrixExists = await db.ApprovalMatrix.findOne({
        where: {
            DocumentTypeID: docID,
            Active: 1,
        },
        transaction: t
    });

    statusValue = matrixExists ? 'Requested' : 'Posted';
    req.body.status = statusValue;

    try {
        const data = req.body;

        // Sanitize numeric fields
        data.businessArea = data.businessArea && data.businessArea !== '' ? parseFloat(data.businessArea) : 0;
        data.totalEmployees = data.totalEmployees && data.totalEmployees !== '' ? parseInt(data.totalEmployees) : 0;
        data.employeesResidingWithLgli = data.employeesResidingWithLgli && data.employeesResidingWithLgli !== '' ? parseInt(data.employeesResidingWithLgli) : 0;
        data.monthlyRental = data.monthlyRental && data.monthlyRental !== '' ? parseFloat(data.monthlyRental) : 0;
        data.numberOfUnits = data.numberOfUnits && data.numberOfUnits !== '' ? parseInt(data.numberOfUnits) : 0;
        data.capitalization = data.capitalization && data.capitalization !== '' ? parseFloat(data.capitalization) : 0;
        data.grossSales = data.grossSales && data.grossSales !== '' ? parseFloat(data.grossSales) : 0;

        // Handle potential empty date strings
        data.dateOfApplication = data.dateOfApplication && data.dateOfApplication !== '' ? data.dateOfApplication : null;
        data.dtiSecCdaRegistrationDate = data.dtiSecCdaRegistrationDate && data.dtiSecCdaRegistrationDate !== '' ? data.dtiSecCdaRegistrationDate : null;

        const newPermit = await BusinessPermit.create({
            ...data,
            status: statusValue,
            createdAt: db.sequelize.fn('GETDATE'),
            updatedAt: db.sequelize.fn('GETDATE')
        }, { transaction: t });

        await t.commit();
        res.status(201).json(newPermit);
    } catch (error) {
        if (t) await t.rollback();
        console.error('❌ Error creating business permit:', error);
        res.status(500).json({ message: 'Failed to create business permit', error: error.message });
    }
};

// Update a Business Permit
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Sanitize numeric fields
        if (data.businessArea !== undefined) data.businessArea = data.businessArea && data.businessArea !== '' ? parseFloat(data.businessArea) : 0;
        if (data.totalEmployees !== undefined) data.totalEmployees = data.totalEmployees && data.totalEmployees !== '' ? parseInt(data.totalEmployees) : 0;
        if (data.employeesResidingWithLgli !== undefined) data.employeesResidingWithLgli = data.employeesResidingWithLgli && data.employeesResidingWithLgli !== '' ? parseInt(data.employeesResidingWithLgli) : 0;
        if (data.monthlyRental !== undefined) data.monthlyRental = data.monthlyRental && data.monthlyRental !== '' ? parseFloat(data.monthlyRental) : 0;
        if (data.numberOfUnits !== undefined) data.numberOfUnits = data.numberOfUnits && data.numberOfUnits !== '' ? parseInt(data.numberOfUnits) : 0;
        if (data.capitalization !== undefined) data.capitalization = data.capitalization && data.capitalization !== '' ? parseFloat(data.capitalization) : 0;
        if (data.grossSales !== undefined) data.grossSales = data.grossSales && data.grossSales !== '' ? parseFloat(data.grossSales) : 0;

        // Handle potential empty date strings
        if (data.dateOfApplication !== undefined) data.dateOfApplication = data.dateOfApplication && data.dateOfApplication !== '' ? data.dateOfApplication : null;
        if (data.dtiSecCdaRegistrationDate !== undefined) data.dtiSecCdaRegistrationDate = data.dtiSecCdaRegistrationDate && data.dtiSecCdaRegistrationDate !== '' ? data.dtiSecCdaRegistrationDate : null;

        const permit = await BusinessPermit.findByPk(id);
        if (!permit) {
            return res.status(404).json({ message: 'Business permit not found' });
        }

        await permit.update({
            ...data,
            updatedAt: db.sequelize.fn('GETDATE')
        });

        // Fetch updated record
        const updatedPermit = await BusinessPermit.findByPk(id);
        res.status(200).json(updatedPermit);
    } catch (error) {
        console.error('❌ Error updating business permit:', error);
        res.status(500).json({ message: 'Failed to update business permit', error: error.message });
    }
};

// Void a Business Permit (replacing hard delete)
exports.delete = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
        const permit = await BusinessPermit.findByPk(id, { transaction: t });

        if (!permit) {
            return res.status(404).json({ message: 'Business permit not found' });
        }

        // Update status to Void instead of deleting
        await permit.update({ status: 'Void' }, { transaction: t });

        // Log the void action to ApprovalAudit
        await ApprovalAudit.create({
            LinkID: id,
            InvoiceLink: id,
            PositionorEmployee: "Employee",
            PositionorEmployeeID: req.user.employeeID,
            SequenceOrder: 0,
            ApprovalOrder: 0,
            Remarks: "Voided",
            RejectionDate: db.sequelize.fn('GETDATE'), // Using RejectionDate to store void date for audit
            CreatedBy: req.user.id,
            CreatedDate: db.sequelize.fn('GETDATE'),
            ApprovalVersion: "1"
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Business permit voided successfully', id, status: 'Void' });
    } catch (error) {
        if (t) await t.rollback();
        console.error('Error voiding business permit:', error);
        res.status(500).json({
            message: 'Failed to void business permit',
            error: error.message
        });
    }
};

exports.approve = async (req, res) => {
    const { id } = req.body;
    const t = await sequelize.transaction();
    try {
        const permit = await BusinessPermit.findByPk(id, { transaction: t });

        if (!permit) throw new Error('Business permit not found.');

        await permit.update({ status: 'Posted' }, { transaction: t });

        await ApprovalAudit.create({
            LinkID: id,
            InvoiceLink: id,
            PositionorEmployee: "Employee",
            PositionorEmployeeID: req.user.employeeID,
            SequenceOrder: 0,
            ApprovalOrder: 0,
            ApprovalDate: db.sequelize.fn('GETDATE'),
            CreatedBy: req.user.id,
            CreatedDate: db.sequelize.fn('GETDATE'),
            ApprovalVersion: "1"
        }, { transaction: t });

        await t.commit();
        res.json({ message: 'Business permit approved and posted successfully.' });
    } catch (error) {
        if (t) await t.rollback();
        console.error('Error approving business permit:', error);
        res.status(500).json({
            error: 'Internal Server Error during approval',
            details: error.message
        });
    }
};

exports.reject = async (req, res) => {
    const { id, reason } = req.body;
    const t = await sequelize.transaction();
    try {
        const permit = await BusinessPermit.findByPk(id, { transaction: t });

        if (!permit) throw new Error('Business permit not found.');

        await permit.update({ status: 'Rejected' }, { transaction: t });

        await ApprovalAudit.create({
            LinkID: id,
            InvoiceLink: id,
            PositionorEmployee: "Employee",
            PositionorEmployeeID: req.user.employeeID,
            SequenceOrder: 0,
            ApprovalOrder: 0,
            Remarks: reason,
            RejectionDate: db.sequelize.fn('GETDATE'),
            CreatedBy: req.user.id,
            CreatedDate: db.sequelize.fn('GETDATE'),
            ApprovalVersion: "1"
        }, { transaction: t });

        await t.commit();
        res.json({ message: 'Business permit rejected successfully.' });
    } catch (error) {
        if (t) await t.rollback();
        console.error('Error rejecting business permit:', error);
        res.status(500).json({
            error: 'Internal Server Error during rejection',
            details: error.message
        });
    }
};
