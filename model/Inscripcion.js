class Inscripcion {
  constructor(id, curso_id, nombre, email, telefono, fecha) {
    this.id = id;
    this.curso_id = curso_id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.fecha = fecha;
  }
}

module.exports = Inscripcion;
