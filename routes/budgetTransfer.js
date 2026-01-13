const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetTransfer');
const requireAuth = require('../middleware/requireAuth');
const createUploader = require('../middleware/uploadFiles');
const uploader = createUploader('budgetTransfer');

router.post('/save', requireAuth, uploader.any(), controller.save);
router.get('/budgetList', requireAuth, controller.budgetList);
router.get('/list', requireAuth, controller.list);
// router.get('/:id', requireAuth, controller.getById);
// router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.delete);
router.post('/reject', requireAuth, controller.rejectTransaction);
router.post('/approve', requireAuth, controller.approveTransaction);
router.post('/recover', requireAuth, controller.recover);
router.post('/delete', requireAuth, controller.delete);
router.post('/void', requireAuth, controller.delete);

module.exports = router;