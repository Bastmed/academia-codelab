const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const cursoRoutes = require('./routes/cursos');
app.use('/', cursoRoutes);

const inscripcionRoutes = require('./routes/inscripciones');
app.use('/', inscripcionRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
