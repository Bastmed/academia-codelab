const db = require('../config/db');

const registrar = (req, res) => {
  const { curso_id, nombre, email, telefono } = req.body;

  if (!curso_id || !nombre || !email || !telefono) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' });
    return;
  }

  db.query(
    'INSERT INTO inscripciones (curso_id, nombre, email, telefono) VALUES (?, ?, ?, ?)',
    [curso_id, nombre, email, telefono],
    (err, resultado) => {
      if (err) {
        res.status(500).json({ error: 'Error al registrar la inscripción' });
        return;
      }
      res.status(201).json({ mensaje: 'Inscripción registrada correctamente' });
    }
  );
};

const listar = (req, res) => {
  const sql = `
    SELECT inscripciones.id, inscripciones.nombre, inscripciones.email,
           inscripciones.telefono, inscripciones.fecha, cursos.nombre AS curso
    FROM inscripciones
    JOIN cursos ON inscripciones.curso_id = cursos.id
    ORDER BY inscripciones.fecha DESC
  `;

  db.query(sql, (err, filas) => {
    if (err) {
      res.status(500).json({ error: 'Error al listar inscripciones' });
      return;
    }
    res.json(filas);
  });
};

module.exports = { registrar, listar };
