// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/cashbook');
// const requireAuth = require('../middleware/requireAuth');

// router.get('/getCashbook', requireAuth, controller.getCashbook);
// router.post('/exportCashbookToExcel', requireAuth, controller.exportCashbookToExcel);


// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/cashbook');
const requireAuth = require('../middleware/requireAuth');

router.post('/view', requireAuth, controller.view);
router.post('/exportExcel', requireAuth, controller.exportExcel);

module.exports = router;