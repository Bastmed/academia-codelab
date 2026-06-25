const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const Curso = require("../model/Curso");

const RUTA_VISTA_PANEL = path.join(__dirname, "../views/admin/panel.html");

const mostrarPanel = (req, res) => {
  db.query("SELECT * FROM cursos", (err, filas) => {
    if (err) {
      return res.status(500).send("Error al cargar el panel");
    }

    const filasHtml = filas
      .map(
        (c) => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.descripcion}</td>
        <td>${c.duracion}</td>
        <td>$${Number(c.precio).toLocaleString("es-CL")}</td>
        <td>${c.cupos}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1 btn-editar"
            data-id="${c.id}" data-nombre="${c.nombre}" data-descripcion="${c.descripcion}"
            data-duracion="${c.duracion}" data-precio="${c.precio}" data-cupos="${c.cupos}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>
    `,
      )
      .join("");

    const plantilla = fs.readFileSync(RUTA_VISTA_PANEL, "utf-8");
    const html = plantilla.replace(
      '<!-- {{FILAS_CURSOS}} -->\n      <tbody id="cuerpo-tabla"></tbody>',
      `<tbody id="cuerpo-tabla">${filasHtml}</tbody>`,
    );

    res.send(html);
  });
};

const listar = (req, res) => {
  db.query("SELECT * FROM cursos", (err, filas) => {
    if (err) {
      res.status(500).json({ error: "Error al listar cursos" });
      return;
    }
    const cursos = filas.map(
      (f) =>
        new Curso(
          f.id,
          f.nombre,
          f.descripcion,
          f.duracion,
          f.precio,
          f.cupos,
          f.imagen,
        ),
    );
    res.json(cursos);
  });
};

const agregar = (req, res) => {
  const { nombre, descripcion, duracion, precio, cupos, imagen } = req.body;

  if (!nombre || !descripcion || !duracion || !precio || !cupos) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  const imagenFinal = imagen || "default.png";

  db.query(
    "INSERT INTO cursos (nombre, descripcion, duracion, precio, cupos, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, duracion, precio, cupos, imagenFinal],
    (err, resultado) => {
      if (err) {
        res.status(500).json({ error: "Error al agregar curso" });
        return;
      }
      res
        .status(201)
        .json(
          new Curso(
            resultado.insertId,
            nombre,
            descripcion,
            duracion,
            precio,
            cupos,
            imagenFinal,
          ),
        );
    },
  );
};

const editar = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, duracion, precio, cupos, imagen } = req.body;

  if (!nombre || !descripcion || !duracion || !precio || !cupos) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  const imagenFinal = imagen || "default.png";

  db.query(
    "UPDATE cursos SET nombre = ?, descripcion = ?, duracion = ?, precio = ?, cupos = ?, imagen = ? WHERE id = ?",
    [nombre, descripcion, duracion, precio, cupos, imagenFinal, id],
    (err, resultado) => {
      if (err) {
        res.status(500).json({ error: "Error al editar curso" });
        return;
      }
      if (resultado.affectedRows === 0) {
        res.status(404).json({ error: "Curso no encontrado" });
        return;
      }
      res.json(
        new Curso(
          id,
          nombre,
          descripcion,
          duracion,
          precio,
          cupos,
          imagenFinal,
        ),
      );
    },
  );
};

const eliminar = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM inscripciones WHERE curso_id = ?", [id], (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al eliminar inscripciones del curso" });
      return;
    }

    db.query("DELETE FROM cursos WHERE id = ?", [id], (err2, resultado) => {
      if (err2) {
        res.status(500).json({ error: "Error al eliminar curso" });
        return;
      }
      if (resultado.affectedRows === 0) {
        res.status(404).json({ error: "Curso no encontrado" });
        return;
      }
      res.json({ mensaje: "Curso eliminado correctamente" });
    });
  });
};

module.exports = { mostrarPanel, listar, agregar, editar, eliminar };
