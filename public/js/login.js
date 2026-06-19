const form = document.getElementById('form-login');
const inputUsuario = document.getElementById('input-usuario');
const inputPassword = document.getElementById('input-password');

form.addEventListener('submit', (evento) => {
  if (!inputUsuario.value.trim() || !inputPassword.value.trim()) {
    evento.preventDefault();
    alert('Completa usuario y contraseña antes de ingresar.');
  }
});
