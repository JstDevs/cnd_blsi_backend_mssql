// const express = require('express');
// const router = express.Router();
// const ctrl = require('../controllers/subsidiaryleadger');

// router.get('/funds', ctrl.getFunds);
// router.get('/accounts', ctrl.getAccounts);
// router.post('/', ctrl.getSubsidiaryLedger);

// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/subsidiaryleadger');
const requireAuth = require('../middleware/requireAuth');

router.post('/view', requireAuth, controller.view);
router.post('/exportExcel', requireAuth, controller.exportExcel);

module.exports = router;