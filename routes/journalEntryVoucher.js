const express = require('express');
const router = express.Router();
const controller = require('../controllers/journalEntryVoucher');
const requireAuth = require('../middleware/requireAuth');
const createUploader = require('../middleware/uploadFiles');
const uploader = createUploader('journalEntryVouchers');

router.post('/', requireAuth, uploader.any(), controller.create);
router.post('/approve', requireAuth, controller.approveTransaction);
router.post('/reject', requireAuth, controller.rejectTransaction);
router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.put('/:id', requireAuth, uploader.any(), controller.update);
router.get('/gl-entries/:linkID', requireAuth, controller.getGLEntries);
router.delete('/', requireAuth, controller.delete);

module.exports = router;