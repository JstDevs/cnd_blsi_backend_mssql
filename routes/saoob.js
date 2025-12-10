const express = require('express');
const router = express.Router();
const controller = require('../controllers/saaobController');
const requireAuth = require('../middleware/requireAuth');

router.get('/getSAAOB', controller.getSAAOB);
router.get('/getSAO', controller.getSAO);
// router.get('/:id', requireAuth, controller.getById);
// router.put('/:id', requireAuth, controller.update);
// router.delete('/:id', requireAuth, controller.delete);

module.exports = router;