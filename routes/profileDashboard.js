const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileDashboard');
const requireAuth = require('../middleware/requireAuth');

router.get('/user', requireAuth, controller.user);
router.get('/userDocumentsList', requireAuth, controller.userDocumentsList);
router.get('/budgetList', requireAuth, controller.budgetList);
router.get('/budgetAPARList/:budgetID', requireAuth, controller.budgetAPARList);
router.get('/disbursementAmounts', requireAuth, controller.disbursementAmounts);
router.get('/obligationChart', requireAuth, controller.obligationChart);
router.get('/travelOrderChart', requireAuth, controller.travelOrderChart);
router.get('/disbursementChart', requireAuth, controller.disbursementChart);
router.get('/collectionTotals', requireAuth, controller.collectionTotals);
router.get('/chartGeneral', requireAuth, controller.collectionCharts('Official Receipt'));
router.get('/chartMarriage', requireAuth, controller.collectionCharts('Marriage Receipt'));
router.get('/chartBurial', requireAuth, controller.collectionCharts('Burial Receipt'));
router.get('/chartCedula', requireAuth, controller.collectionBarCharts('Community Tax Certificate'));

module.exports = router;