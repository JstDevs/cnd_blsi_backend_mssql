const { users } = require('../config/database');
const { UserUserAccess } = require('../config/database');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const {getAllWithAssociations}=require("../models/associatedDependency");
const db=require('../config/database')
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

exports.create = async (req, res) => {
  try {
    let { EmployeeID, UserName, Password, UserAccessArray } = req.body;

    // Check if username already exists
    const existingUser = await users.findOne({
        where: { UserName: UserName }
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    Password = await hashPassword(Password);

    const item = await users.create({ EmployeeID, UserName, Password, Active: true, CreatedBy: req.user.id, CreatedDate: new Date() });
    
    
    // 🟢 Now create new ones
    for (const accessId of UserAccessArray) {
        await UserUserAccess.create({
            UserID: item.ID,
            UserAccessID: accessId
        });
    }

    res.status(201).json({message: "Success"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items= await getAllWithAssociations(db.users,2)
    // const items = await users.findAll();
    res.json({
      status:true,
      items
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await users.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "users not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let { EmployeeID, UserName, Password, UserAccessArray } = req.body;
    
    // Check if username already exists
    const existingUser = await users.findOne({
      where: {
        UserName: UserName,
        ID: { [Op.ne]: req.params.id } // Exclude current user from check
      }
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    Password = await hashPassword(Password);

    const [updated] = await users.update({ EmployeeID, UserName, Password }, {
      where: { id: req.params.id }
    });
    let updatedItem;
    if (updated) {
      updatedItem = await users.findByPk(req.params.id);
    } else {
      throw new Error("User not found");
    }
    
    // 🔴 Delete all previous accesses for this user
    await UserUserAccess.destroy({
        where: { UserID: updatedItem.ID }
    });

    // 🟢 Now create new ones
    for (const accessId of UserAccessArray) {
        await UserUserAccess.create({
            UserID: updatedItem.ID,
            UserAccessID: accessId
        });
    }

    res.json({message: "success"});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await users.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "users deleted" });
    else res.status(404).json({ message: "users not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};