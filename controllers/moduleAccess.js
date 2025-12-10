const { ModuleAccess } = require('../config/database');
const db = require('../config/database');
const {getAllWithAssociations}=require("../models/associatedDependency");
exports.create = async (req, res) => {
  try {
    const { UserAccessID, modules } = req.body;
    for (const module of modules) {
      const { ModuleID, View, Add, Edit, Delete, Print, Mayor } = module;
      await ModuleAccess.create({ UserAccessID, ModuleID, View, Add, Edit, Delete, Print, Mayor });
    }
    // const item = await ModuleAccess.create({ UserAccessID, ModuleID, View, Add, Edit, Delete, Print, Mayor });
    res.status(201).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(ModuleAccess)
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await getAllWithAssociations(ModuleAccess,1,  { UserAccessID: req.params.id } )
    if (item) res.json(item);
    else res.status(404).json({ message: "ModuleAccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.update = async (req, res) => {
//   try {
//       const { UserAccessID, modules } = req.body;
//     for (const module of modules) {
//       const { ModuleID, View, Add, Edit, Delete, Print, Mayor,id } = module;
//       const [updated] = await ModuleAccess.update({ UserAccessID, ModuleID, View, Add, Edit, Delete, Print, Mayor }, {
//           where: { id:id }
//         });
//     }
   
//     return res.json({
//       status:true
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.update = async (req, res) => {
  try {
    const { UserAccessID, modules } = req.body;

    for (const module of modules) {
      const { ModuleID, View, Add, Edit, Delete, Print, Mayor, id } = module;

      if (id) {
        await ModuleAccess.update(
          { UserAccessID, ModuleID, View, Add, Edit, Delete, Print, Mayor },
          { where: { ID: id } }
        );
      } else {
        const existing = await ModuleAccess.findOne({
          where: { UserAccessID, ModuleID },
        });

        if (existing) {
          await ModuleAccess.update(
            { View, Add, Edit, Delete, Print, Mayor },
            { where: { ID: existing.ID } }
          );
        } else {
          await ModuleAccess.create({
            UserAccessID,
            ModuleID,
            View,
            Add,
            Edit,
            Delete,
            Print,
            Mayor,
          });
        }
      }
    }

    return res.json({ status: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.delete = async (req, res) => {
  try {
    const deleted = await ModuleAccess.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "ModuleAccess deleted" });
    else res.status(404).json({ message: "ModuleAccess not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};