const contenedor = document.getElementById('contenedor-cursos');

const cargarCursos = async () => {
  try {
    const respuesta = await fetch('/api/cursos');
    const cursos = await respuesta.json();

    contenedor.innerHTML = '';

    if (cursos.length === 0) {
      contenedor.innerHTML = '<div class="col-12 text-center text-muted">Aún no hay cursos publicados.</div>';
      return;
    }

    cursos.forEach((curso) => {
      const columna = document.createElement('div');
      columna.className = 'col-md-4';
      columna.innerHTML = `
        <div class="card card-curso p-3">
          <h5 class="fw-bold">${curso.nombre}</h5>
          <p class="text-muted small">${curso.descripcion}</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="text-muted small">${curso.duracion}</span>
            <span class="badge badge-cupos">${curso.cupos} cupos</span>
          </div>
          <div class="fw-bold mt-2" style="color:#1f3d73;">
            $${Number(curso.precio).toLocaleString('es-CL')}
          </div>
          <button class="btn btn-outline-primary btn-sm mt-3 btn-inscribirse"
            data-id="${curso.id}" data-nombre="${curso.nombre}">Reservar cupo</button>
        </div>
      `;
      columna.querySelector('.btn-inscribirse').addEventListener('click', (e) => {
        const btn = e.target;
        document.getElementById('modal-curso-id').value = btn.dataset.id;
        document.getElementById('modal-curso-nombre').textContent = btn.dataset.nombre;
        document.getElementById('inscripcion-mensaje').textContent = '';
        document.getElementById('form-inscripcion').reset();
        new bootstrap.Modal(document.getElementById('modalInscripcion')).show();
      });
      contenedor.appendChild(columna);
    });

  } catch (err) {
    contenedor.innerHTML = `<div class="col-12 text-center text-danger">Error al cargar cursos: ${err.message}</div>`;
  }
};

cargarCursos();

const formInscripcion = document.getElementById('form-inscripcion');
const mensajeInscripcion = document.getElementById('inscripcion-mensaje');

formInscripcion.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const datos = {
    curso_id: document.getElementById('modal-curso-id').value,
    nombre: document.getElementById('inscripcion-nombre').value.trim(),
    email: document.getElementById('inscripcion-email').value.trim(),
    telefono: document.getElementById('inscripcion-telefono').value.trim()
  };

  try {
    const respuesta = await fetch('/api/inscripciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
      mensajeInscripcion.className = 'small text-success';
      mensajeInscripcion.textContent = '¡Listo! Te hemos registrado, pronto te contactaremos.';
      formInscripcion.reset();
    } else {
      mensajeInscripcion.className = 'small text-danger';
      mensajeInscripcion.textContent = 'No se pudo completar la inscripción. Intenta nuevamente.';
    }

  } catch (err) {
    mensajeInscripcion.className = 'small text-danger';
    mensajeInscripcion.textContent = `Error: ${err.message}`;
  }
});
