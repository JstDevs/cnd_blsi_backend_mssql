const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionreport');
const requireAuth = require('../middleware/requireAuth');

router.get('/daily', requireAuth, controller.getCollectionSummaryDaily);

router.get('/monthly', requireAuth, controller.getCollectionSummaryMonthly);
router.get('/quarterly', requireAuth, controller.getCollectionSummaryQuarterly);
router.get('/flexible', requireAuth, controller.getCollectionSummaryFlexible);

router.get('/dailyExcel', requireAuth, controller.exportExcelDaily);
router.get('/monthlyExcel', requireAuth, controller.exportExcelMonthly);
router.get('/quarterlyExcel', requireAuth, controller.exportExcelQuarterly);
router.get('/flexibleExcel', requireAuth, controller.exportExcelFlexible);


module.exports = router;