const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscripcionController');

router.post('/api/inscripciones', controller.registrar);
router.get('/api/inscripciones', controller.listar);

module.exports = router;
