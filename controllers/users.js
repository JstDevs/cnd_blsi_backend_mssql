const { users, UserUserAccess, userAccess, employee } = require('../config/database');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
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

    const item = await users.create({
      EmployeeID,
      UserName,
      Password,
      Active: true,
      CreatedBy: req.user.id,
      CreatedDate: db.sequelize.fn('GETDATE')
    });

    // 🟢 Now create new ones
    for (const accessId of UserAccessArray) {
      await UserUserAccess.create({
        UserID: item.ID,
        UserAccessID: accessId
      });
    }

    res.status(201).json({ message: "Success" });
  } catch (err) {
    console.error('Users create error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await users.findAll({
      where: { Active: true },
      include: [
        {
          model: userAccess,
          as: 'accessList',
          required: false
        },
        {
          model: employee,
          as: 'Employee',
          required: false
        }
      ],
      order: [['ID', 'ASC']]
    });

    res.json({
      status: true,
      items
    });
  } catch (err) {
    console.error('Users getAll error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await users.findOne({ where: { ID: req.params.id, Active: true } });
    if (item) res.json(item);
    else res.status(404).json({ message: "users not found" });
  } catch (err) {
    console.error('Users getById error:', err);
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
        ID: { [Op.ne]: req.params.id }
      }
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    Password = await hashPassword(Password);

    const [updated] = await users.update({
      EmployeeID,
      UserName,
      Password,
      ModifyBy: req.user.id,
      ModifyDate: db.sequelize.fn('GETDATE')
    }, {
      where: { ID: req.params.id, Active: true }
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

    res.json({ message: "success" });

  } catch (err) {
    console.error('Users update error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const [updated] = await users.update(
      { Active: false, ModifyBy: req.user?.id ?? 1, ModifyDate: db.sequelize.fn('GETDATE') },
      { where: { ID: req.params.id, Active: true } }
    );
    if (updated) res.json({ message: "users deactivated" });
    else res.status(404).json({ message: "users not found" });
  } catch (err) {
    console.error('Users delete error:', err);
    res.status(500).json({ error: err.message });
  }
};