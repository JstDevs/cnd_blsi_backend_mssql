const express = require('express');
const router = express.Router();
const controller = require('../controllers/generalservicerecipt');
const requireAuth = require('../middleware/requireAuth');
const createUploader = require('../middleware/uploadFiles');
const uploader = createUploader('generalServiceRecipts');

router.post('/', requireAuth, uploader.any(), controller.saveTransaction);
router.get('/', requireAuth, controller.getAll);
// router.get('/:id', controller.getById);
// router.put('/:id', controller.update);
router.delete('/:id', requireAuth, controller.deleteTransaction);
router.get('/getCurrentNumber', requireAuth, controller.getCurrentNumber);

module.exports = router;