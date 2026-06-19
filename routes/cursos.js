const express = require('express');
const router = express.Router();
const controller = require('../controllers/cursoController');

router.get('/admin/panel', controller.mostrarPanel);

router.get('/api/cursos', controller.listar);
router.post('/api/cursos', controller.agregar);
router.put('/api/cursos/:id', controller.editar);
router.delete('/api/cursos/:id', controller.eliminar);

module.exports = router;
