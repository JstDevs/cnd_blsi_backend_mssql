const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bir');
const requireAuth = require('../middleware/requireAuth');

router.post('/getGeneralJournal', requireAuth, ctrl.getGeneralJournal);
router.post('/print/vendor', requireAuth, ctrl.print2307Vendor);
router.post('/print/employee', requireAuth, ctrl.print2307Employee);

// new
router.post('/view', requireAuth, ctrl.view);

module.exports = router;
