const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trialbalance');

router.get('/funds', ctrl.getFunds);
router.get('/employees', ctrl.getEmployees);
router.post('/', ctrl.getTrialBalance);

module.exports = router;
