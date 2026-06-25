const contenedor = document.getElementById("contenedor-cursos");

const generarPDF = (datos) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(21, 42, 79);
  doc.text("Academia CodeLab", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Confirmación de Inscripción", 105, 35, { align: "center" });

  doc.setDrawColor(21, 42, 79);
  doc.line(20, 40, 190, 40);

  doc.setFontSize(12);
  doc.text(`Nombre:   ${datos.nombre}`, 20, 55);
  doc.text(`Email:    ${datos.email}`, 20, 65);
  doc.text(`Teléfono: ${datos.telefono}`, 20, 75);
  doc.text(`Curso:    ${datos.curso}`, 20, 90);
  doc.text(`Duración: ${datos.duracion}`, 20, 100);
  doc.text(
    `Precio:   $${Number(datos.precio).toLocaleString("es-CL")}`,
    20,
    110,
  );
  doc.text(`Fecha:    ${new Date().toLocaleDateString("es-CL")}`, 20, 120);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Gracias por inscribirte. Pronto nos pondremos en contacto contigo.",
    105,
    140,
    { align: "center" },
  );

  doc.save(`inscripcion-${datos.nombre.replace(/ /g, "-")}.pdf`);
};

const cargarCursos = async () => {
  try {
    const respuesta = await fetch("/api/cursos");
    const cursos = await respuesta.json();

    contenedor.innerHTML = "";
    document.getElementById("stat-cursos").textContent = cursos.length;

    if (cursos.length === 0) {
      contenedor.innerHTML =
        '<div class="col-12 text-center text-muted">Aún no hay cursos publicados.</div>';
      return;
    }

    document.getElementById("stat-cursos").textContent = cursos.length;
    const totalCupos = cursos.reduce((acc, c) => acc + Number(c.cupos), 0);
    document.getElementById("stat-cupos").textContent = totalCupos;

    cursos.forEach((curso) => {
      const columna = document.createElement("div");
      columna.className = "col-md-4";
      columna.innerHTML = `
        <div class="card card-curso p-3">
          <img src="/img/cursos/${curso.imagen || "default.png"}" alt="${curso.nombre}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
          <h5 class="fw-bold">${curso.nombre}</h5>
          <p class="text-muted small">${curso.descripcion}</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="text-muted small">${curso.duracion}</span>
            <span class="badge badge-cupos">${curso.cupos} cupos</span>
          </div>
          <div class="fw-bold mt-2" style="color:#1f3d73;">
            $${Number(curso.precio).toLocaleString("es-CL")}
          </div>
          <button class="btn btn-outline-primary btn-sm mt-3 btn-inscribirse"
            data-id="${curso.id}" data-nombre="${curso.nombre}">Reservar cupo</button>
        </div>
      `;
      columna
        .querySelector(".btn-inscribirse")
        .addEventListener("click", (e) => {
          const btn = e.target;
          document.getElementById("modal-curso-id").value = btn.dataset.id;
          document.getElementById("modal-curso-nombre").textContent =
            btn.dataset.nombre;
          document.getElementById("inscripcion-mensaje").textContent = "";
          document.getElementById("form-inscripcion").reset();
          new bootstrap.Modal(
            document.getElementById("modalInscripcion"),
          ).show();
        });
      contenedor.appendChild(columna);
    });
  } catch (err) {
    contenedor.innerHTML = `<div class="col-12 text-center text-danger">Error al cargar cursos: ${err.message}</div>`;
  }
};

cargarCursos();

const formInscripcion = document.getElementById("form-inscripcion");
const mensajeInscripcion = document.getElementById("inscripcion-mensaje");

formInscripcion.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datos = {
    curso_id: document.getElementById("modal-curso-id").value,
    nombre: document.getElementById("inscripcion-nombre").value.trim(),
    email: document.getElementById("inscripcion-email").value.trim(),
    telefono: document.getElementById("inscripcion-telefono").value.trim(),
  };

  try {
    const respuesta = await fetch("/api/inscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      generarPDF({
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        curso: resultado.curso,
        duracion: resultado.duracion,
        precio: resultado.precio,
      });
      mensajeInscripcion.className = "small text-success";
      mensajeInscripcion.textContent =
        "¡Listo! Te hemos registrado. Se descargó tu comprobante.";
      formInscripcion.reset();
      cargarCursos();
    } else {
      mensajeInscripcion.className = "small text-danger";
      mensajeInscripcion.textContent =
        resultado.error || "No se pudo completar la inscripción.";
    }
  } catch (err) {
    mensajeInscripcion.className = "small text-danger";
    mensajeInscripcion.textContent = `Error: ${err.message}`;
  }
});
