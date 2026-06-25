class Curso {
  constructor(id, nombre, descripcion, duracion, precio, cupos, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.duracion = duracion;
    this.precio = precio;
    this.cupos = cupos;
    this.imagen = imagen || 'default.png';
  }
}

module.exports = Curso;