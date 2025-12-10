
const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxcertificatecorp');
const requireAuth = require('../middleware/requireAuth');

router.post('/save', requireAuth, controller.save);
router.get('/getall', requireAuth, controller.getAll);
router.delete('/:id', requireAuth, controller.delete);
// Get single certificate
// router.get('/:id', async (req, res) => {
//   try {
//     const cert = await CommunityTax.findByPk(req.params.id);
//     if (!cert) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: cert });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // Delete (soft delete)
// router.delete('/:id', async (req, res) => {
//   try {
//     await CommunityTax.update({ Active: false }, { where: { ID: req.params.id } });
//     res.json({ success: true, message: 'Deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
// router.get('/', controller.getAll);
// router.get('/:id', controller.getById);
// router.put('/:id', controller.update);
// router.delete('/:id', controller.delete);

module.exports = router;