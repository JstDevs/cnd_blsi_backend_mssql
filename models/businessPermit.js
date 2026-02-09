const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('BusinessPermit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        applicantType: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        modeOfPayment: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        dateOfApplication: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        dtiSecCdaRegistrationNo: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        dtiSecCdaRegistrationDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        tinNo: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        typeOfBusiness: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        amendmentFrom: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        amendmentTo: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        taxIncentiveFromGovEntity: {
            type: DataTypes.STRING(10), // 'yes' or 'no'
            defaultValue: 'no',
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        middleName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        businessName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tradeNameFranchise: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        businessRegion: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        businessProvince: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        businessMunicipality: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        businessBarangay: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        businessStreetAddress: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        postalCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        emailAddress: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        telephoneNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        mobileNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ownerStreetAddress: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        ownerBarangay: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ownerMunicipality: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ownerRegion: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ownerPostalCode: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        ownerEmailAddress: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        ownerTelephoneNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ownerMobileNo: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        emergencyContactPerson: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        emergencyContactNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        emergencyContactEmail: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        businessArea: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        totalEmployees: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        employeesResidingWithLgli: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lessorFullName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        lessorAddress: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        lessorContactNumber: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        lessorEmail: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        monthlyRental: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },
        lineOfBusiness: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        numberOfUnits: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        capitalization: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },
        grossSales: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'Requested',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'createdAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updatedAt'
        },
    }, {
        sequelize,
        tableName: 'business_permits',
        timestamps: false,
    });
};
