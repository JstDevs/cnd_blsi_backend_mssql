
const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxcertificate');
const requireAuth = require('../middleware/requireAuth');

router.post('/save', requireAuth, controller.saveCustomerAndCTC);
router.get('/getall', requireAuth, controller.getall);
router.get('/getCurrentNumber', requireAuth, controller.getCurrentNumber);

// Get single certificate
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const cert = await CommunityTax.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete (soft delete)
router.delete('/:id', requireAuth, controller.deleteCustomerCTC);
// router.get('/', controller.getAll);
// router.get('/:id', controller.getById);
// router.put('/:id', controller.update);
// router.delete('/:id', controller.delete);

module.exports = router;