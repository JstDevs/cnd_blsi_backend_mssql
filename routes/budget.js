const express = require('express');
const router = express.Router();
const controller = require('../controllers/budget');
const requireAuth = require('../middleware/requireAuth');

router.post("/createOrUpdateBudgetAllotment",requireAuth, controller.createOrUpdateBudgetAllotment);
router.get("/getAllotmentList",requireAuth, controller.getAllotmentList);
router.get("/budgetlist",requireAuth, controller.budgetlist);
router.post("/saveBudgetSupplemental",requireAuth, controller.saveBudgetSupplemental);
router.get("/budgetsupplemental",requireAuth, controller.budgetsupplemental);
router.post("/budgettransefer",requireAuth, controller.saveBudgetTransfer);
router.get("/budgettransfer",requireAuth, controller.budgettransfer);
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
module.exports = router;