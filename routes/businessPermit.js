const express = require('express');
const router = express.Router();
const businessPermitController = require('../controllers/businessPermit');
const requireAuth = require('../middleware/requireAuth');

// Define routes
// Prefix: /business-permit (defined in index.js)

// GET all
router.get('/getall', requireAuth, businessPermitController.getAll);

// GET one by ID
router.get('/:id', requireAuth, businessPermitController.getById);

// POST create
router.post('/save', requireAuth, businessPermitController.create);

// PUT update
router.put('/:id', requireAuth, businessPermitController.update);

// DELETE
router.delete('/:id', requireAuth, businessPermitController.delete);

// APPROVE
router.post('/approve', requireAuth, businessPermitController.approve);

// REJECT
router.post('/reject', requireAuth, businessPermitController.reject);

module.exports = router;
