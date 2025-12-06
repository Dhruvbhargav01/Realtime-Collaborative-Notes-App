// backend/routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/noteController');

router.post('/', ctrl.createNote);
router.get('/:id', ctrl.getNote);
router.put('/:id', ctrl.updateNote);

module.exports = router;
