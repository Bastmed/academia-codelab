const tbody = document.getElementById('cuerpo-tabla');
const inputId = document.getElementById('curso-id');
const inputNombre = document.getElementById('input-nombre');
const inputDescripcion = document.getElementById('input-descripcion');
const inputDuracion = document.getElementById('input-duracion');
const inputPrecio = document.getElementById('input-precio');
const inputCupos = document.getElementById('input-cupos');
const tituloForm = document.getElementById('titulo-formulario');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

const recargarTabla = async () => {
  try {
    const respuesta = await fetch('/api/cursos');
    const cursos = await respuesta.json();

    tbody.innerHTML = '';

    cursos.forEach((c) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.descripcion}</td>
        <td>${c.duracion}</td>
        <td>$${Number(c.precio).toLocaleString('es-CL')}</td>
        <td>${c.cupos}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1 btn-editar">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
        </td>
      `;

      fila.querySelector('.btn-editar').addEventListener('click', () => prepararEdicion(c));
      fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminar(c.id));

      tbody.appendChild(fila);
    });

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Error: ${err.message}</td></tr>`;
  }
};

document.querySelectorAll('.btn-editar').forEach((btn) => {
  btn.addEventListener('click', () => {
    prepararEdicion({
      id: btn.dataset.id,
      nombre: btn.dataset.nombre,
      descripcion: btn.dataset.descripcion,
      duracion: btn.dataset.duracion,
      precio: btn.dataset.precio,
      cupos: btn.dataset.cupos
    });
  });
});

document.querySelectorAll('.btn-eliminar').forEach((btn) => {
  btn.addEventListener('click', () => eliminar(btn.dataset.id));
});

const guardar = async () => {
  const id = inputId.value;
  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const duracion = inputDuracion.value.trim();
  const precio = inputPrecio.value;
  const cupos = inputCupos.value;

  if (!nombre || !descripcion || !duracion || !precio || !cupos) {
    alert('Completa todos los campos antes de guardar.');
    return;
  }

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `/api/cursos/${id}` : '/api/cursos';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, duracion, precio, cupos })
    });

    if (respuesta.ok) {
      limpiarFormulario();
      recargarTabla();
    } else {
      alert('No se pudo guardar el curso.');
    }

  } catch (err) {
    alert(`Error al guardar: ${err.message}`);
  }
};

const prepararEdicion = (curso) => {
  inputId.value = curso.id;
  inputNombre.value = curso.nombre;
  inputDescripcion.value = curso.descripcion;
  inputDuracion.value = curso.duracion;
  inputPrecio.value = curso.precio;
  inputCupos.value = curso.cupos;
  tituloForm.textContent = 'Editar Curso';
};

const eliminar = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este curso?')) return;

  try {
    const respuesta = await fetch(`/api/cursos/${id}`, { method: 'DELETE' });

    if (respuesta.ok) {
      recargarTabla();
    } else {
      alert('No se pudo eliminar el curso.');
    }

  } catch (err) {
    alert(`Error al eliminar: ${err.message}`);
  }
};

const limpiarFormulario = () => {
  inputId.value = '';
  inputNombre.value = '';
  inputDescripcion.value = '';
  inputDuracion.value = '';
  inputPrecio.value = '';
  inputCupos.value = '';
  tituloForm.textContent = 'Agregar Curso';
};

btnGuardar.addEventListener('click', guardar);
btnCancelar.addEventListener('click', limpiarFormulario);

const cuerpoInscripciones = document.getElementById('cuerpo-inscripciones');

const cargarInscripciones = async () => {
  try {
    const respuesta = await fetch('/api/inscripciones');
    const inscripciones = await respuesta.json();

    if (inscripciones.length === 0) {
      cuerpoInscripciones.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Aún no hay inscripciones.</td></tr>';
      return;
    }

    cuerpoInscripciones.innerHTML = inscripciones.map((i) => `
      <tr>
        <td>${i.nombre}</td>
        <td>${i.email}</td>
        <td>${i.telefono}</td>
        <td>${i.curso}</td>
        <td>${new Date(i.fecha).toLocaleString('es-CL')}</td>
      </tr>
    `).join('');

  } catch (err) {
    cuerpoInscripciones.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error: ${err.message}</td></tr>`;
  }
};

cargarInscripciones();
