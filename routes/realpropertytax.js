const express = require('express');
const router = express.Router();
const controller = require('../controllers/realpropertytax');
const requireAuth = require('../middleware/requireAuth');

router.post('/save', requireAuth, controller.save);
router.post('/postTransaction', requireAuth, controller.postTransaction);
router.post('/rejectTransaction', requireAuth, controller.rejectTransaction);
router.get('/list', requireAuth, controller.list);
router.get('/addButton', requireAuth, controller.addPresentList);
router.get('/getTdNumber', requireAuth, controller.getTDNumbersByOwner);
// router.get('/', requireAuth, controller.getAll);
// router.get('/:id', requireAuth, controller.getById);
// router.put('/:id', requireAuth, controller.update);
// router.delete('/:id', requireAuth, controller.delete);

module.exports = router;