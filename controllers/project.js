const { Project, ProjectType } = require('../config/database');
const project = Project;

exports.create = async (req, res) => {
  try {
    const { Title, ProjectTypeID, Description, StartDate, EndDate } = req.body;
    const item = await project.create({ Title, ProjectTypeID, Description, StartDate, EndDate, Active: true });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await project.findAll({
      where: { Active: true},
      include: [
        {
          model: ProjectType,
          as: 'ProjectType',
          required: false
        }
      ]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await project.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "project not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { Title, ProjectTypeID, Description, StartDate, EndDate } = req.body;
    const [updated] = await project.update({ Title, ProjectTypeID, Description, StartDate, EndDate}, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await project.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    // const deleted = await project.destroy({ where: { id: req.params.id } });

    const [updated] = await project.update(
      { Active: false, ModifyBy: req.user.id, ModifyDate: new Date() },
      { where: { id: req.params.id, Active: true } }
    );

    if (updated) res.json({ message: "project deactivated" });
    else res.status(404).json({ message: "project not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};