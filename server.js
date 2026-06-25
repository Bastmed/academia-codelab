const express  = require('express');
const path     = require('path');
const multer   = require('multer');
const app      = express();
const PORT     = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/img/cursos/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes        = require('./routes/auth');
const cursoRoutes       = require('./routes/cursos');
const inscripcionRoutes = require('./routes/inscripciones');

app.use('/', authRoutes);
app.use('/', cursoRoutes);
app.use('/', inscripcionRoutes);

app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se subió ningún archivo' });
    return;
  }
  res.json({ nombre: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});