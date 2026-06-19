const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const RUTA_VISTA = path.join(__dirname, '../views/public/login.html');

const mostrarLogin = (req, res) => {
  res.send(renderLogin());
};

const login = (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.send(renderLogin('Debes ingresar usuario y contraseña.'));
  }

  db.query(
    'SELECT * FROM usuarios WHERE usuario = ? AND password = ?',
    [usuario, password],
    (err, filas) => {
      if (err) {
        return res.send(renderLogin('Error del servidor. Intenta nuevamente.'));
      }

      if (filas.length === 0) {
        return res.send(renderLogin('Usuario o contraseña incorrectos.'));
      }

      res.redirect('/admin/panel');
    }
  );
};

function renderLogin(error) {
  const plantilla = fs.readFileSync(RUTA_VISTA, 'utf-8');
  const bloqueError = error
    ? `<div class="alert alert-danger py-2" id="mensaje-error">${error}</div>`
    : '';

  return plantilla.replace('<!-- {{MENSAJE_ERROR}} -->', bloqueError);
}

module.exports = { login, mostrarLogin };
