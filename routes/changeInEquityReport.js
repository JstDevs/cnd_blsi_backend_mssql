const express = require('express');
const router = express.Router();
const controller = require('../controllers/changeInEquityReport');
const auth = require('../middleware/auth');

router.post('/view', auth, controller.view);
router.post('/exportExcel', auth, controller.exportExcel);

module.exports = router;