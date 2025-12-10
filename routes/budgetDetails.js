const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetDetails');
const requireAuth = require('../middleware/requireAuth');

router.post('/save', requireAuth, controller.save);
router.get('/getAll', requireAuth, controller.getAll);
// router.get('/:id', requireAuth, controller.getById);
// router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;