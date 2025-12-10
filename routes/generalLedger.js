// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/generalLedger');
// router.get("/getGeneralLedgerData",controller.getGeneralLedgerData)
// router.post('/', controller.create);
// router.get('/', controller.getAll);
// router.get('/:id', controller.getById);
// router.put('/:id', controller.update);
// router.delete('/:id', controller.delete);


// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalLedger');
const requireAuth = require('../middleware/requireAuth');

router.post('/view', requireAuth, controller.view);
router.post('/exportExcel', requireAuth, controller.exportExcel);

module.exports = router;