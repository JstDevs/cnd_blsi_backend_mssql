const express = require('express');
const router = express.Router();
const controller = require('../controllers/publicMarketTicketing');
const requireAuth = require('../middleware/requireAuth');

router.post('/save', requireAuth, controller.save);
router.get('/', requireAuth, controller.getAll);
// router.get('/:id', requireAuth, controller.getById);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;