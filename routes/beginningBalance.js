const express = require('express');
const router = express.Router();
const controller = require('../controllers/beginningBalance');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, controller.create);
router.post('/transfer', requireAuth, controller.transfer);
router.post('/list', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;