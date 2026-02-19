const express = require('express');
const router = express.Router();
const alphalistController = require('../controllers/alphalist');
// const { protect } = require('../middleware/auth'); // If applicable

router.post('/view', alphalistController.fetchAlphalist);
router.post('/exportExcel', alphalistController.exportExcel);

module.exports = router;
