const db = require("../config/db");

const registrar = (req, res) => {
  const { curso_id, nombre, email, telefono } = req.body;

  if (!curso_id || !nombre || !email || !telefono) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  db.query(
    "SELECT cupos, nombre, duracion, precio FROM cursos WHERE id = ?",
    [curso_id],
    (err, filas) => {
      if (err || filas.length === 0) {
        res.status(404).json({ error: "Curso no encontrado" });
        return;
      }

      const curso = filas[0];

      if (curso.cupos <= 0) {
        res
          .status(400)
          .json({ error: "No hay cupos disponibles para este curso" });
        return;
      }

      db.query(
        "INSERT INTO inscripciones (curso_id, nombre, email, telefono) VALUES (?, ?, ?, ?)",
        [curso_id, nombre, email, telefono],
        (err, resultado) => {
          if (err) {
            res
              .status(500)
              .json({ error: "Error al registrar la inscripción" });
            return;
          }

          db.query(
            "UPDATE cursos SET cupos = cupos - 1 WHERE id = ?",
            [curso_id],
            (err2) => {
              if (err2) {
                console.error("Error al actualizar cupos:", err2.message);
              }
            },
          );

          res.status(201).json({
            mensaje: "Inscripción registrada correctamente",
            curso: curso.nombre,
            duracion: curso.duracion,
            precio: curso.precio,
          });
        },
      );
    },
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
      res.status(500).json({ error: "Error al listar inscripciones" });
      return;
    }
    res.json(filas);
  });
};

module.exports = { registrar, listar };
