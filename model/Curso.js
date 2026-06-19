class Curso {
  constructor(id, nombre, descripcion, duracion, precio, cupos) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.duracion = duracion;
    this.precio = precio;
    this.cupos = cupos;
  }
}

module.exports = Curso;
