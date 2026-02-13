const express = require('express');
const router = express.Router();
const controller = require('../controllers/financialPositionReport');
const requireAuth = require('../middleware/requireAuth');

router.post('/view', requireAuth, controller.view);
router.post('/exportExcel', requireAuth, controller.exportExcel);

module.exports = router;
