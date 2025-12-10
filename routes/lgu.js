const express = require('express');
const router = express.Router();
const controller = require('../controllers/lgu');
const requireAuth = require('../middleware/requireAuth');

const createUploader = require('../middleware/uploadFiles');
const uploader = createUploader('images');

router.post('/', requireAuth, uploader.single('Logo'), controller.create);
router.get('/', requireAuth, controller.getAll);
router.get('/:id', requireAuth, controller.getById);
router.put('/:id', requireAuth, uploader.single('Logo'), controller.update);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;
