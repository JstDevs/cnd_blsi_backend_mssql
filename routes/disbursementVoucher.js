const express = require('express');
const router = express.Router();
const controller = require('../controllers/disbursementVoucher');
const requireAuth = require('../middleware/requireAuth');
const createUploader = require('../middleware/uploadFiles');
const uploader = createUploader('obligationRequests');

router.post('/save', requireAuth, uploader.any(), controller.save);
router.post('/approve', requireAuth, uploader.any(), controller.approve);
router.post('/reject', requireAuth, uploader.any(), controller.reject);
// router.post('/', requireAuth, uploader.any(), controller.create);
router.get('/', requireAuth, controller.getAll);
router.get('/selectListForDV', requireAuth, controller.selectListForDV);
router.get('/pending-cheque', requireAuth, controller.getPendingChequeDVs);
router.get('/:id', requireAuth, controller.getById);
// router.put('/:id', requireAuth, uploader.any(), controller.update);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;
