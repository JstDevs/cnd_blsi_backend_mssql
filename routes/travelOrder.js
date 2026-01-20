const express = require('express');
const router = express.Router();
const controller = require('../controllers/travelOrder');
const requireAuth = require('../middleware/requireAuth');
const createUploader = require('../middleware/uploadFiles');
const uploader = createUploader('travelOrders');

router.post('/', requireAuth, uploader.any(), controller.create);
router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.put('/:id', requireAuth, uploader.any(), controller.update);
router.delete('/:id', requireAuth, controller.delete);
router.post('/approve', requireAuth, controller.approveTransaction);
router.post('/reject', requireAuth, controller.rejectTransaction);

module.exports = router;