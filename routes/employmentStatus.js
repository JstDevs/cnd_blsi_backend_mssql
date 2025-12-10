const express = require('express');
const router = express.Router();
const controller = require('../controllers/employmentStatus');
const requireAuth = require('../middleware/requireAuth');

router.post('/', controller.create);
router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;