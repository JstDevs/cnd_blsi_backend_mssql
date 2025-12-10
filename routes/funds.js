const express = require('express');
const router = express.Router();
const controller = require('../controllers/funds');
const requireAuth = require('../middleware/requireAuth');

router.get("/search", requireAuth, controller.search);
router.post("/savefundtransfer", requireAuth, controller.savefundtransfer);
router.get("/transferlist", requireAuth, controller.transferlist);
router.post('/', requireAuth, controller.saveRecord);
// router.post('/', controller.create);
router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
// router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.delete);
// router.get("/getall", controller.getAllFunds);

module.exports = router;