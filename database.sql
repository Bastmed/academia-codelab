CREATE DATABASE IF NOT EXISTS academia_codelab;
USE academia_codelab;

CREATE TABLE cursos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  duracion    VARCHAR(50)  NOT NULL,
  precio      INT          NOT NULL,
  cupos       INT          NOT NULL,
  imagen      VARCHAR(255) NOT NULL DEFAULT 'default.png'
);

CREATE TABLE usuarios (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  usuario   VARCHAR(50)  NOT NULL UNIQUE,
  password  VARCHAR(100) NOT NULL
);

CREATE TABLE inscripciones (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  curso_id  INT NOT NULL,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(100) NOT NULL,
  telefono  VARCHAR(20)  NOT NULL,
  fecha     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

INSERT INTO cursos (nombre, descripcion, duracion, precio, cupos, imagen) VALUES
('Introducción a Programación', 'Lógica de programación y fundamentos con JavaScript', '8 semanas', 89990, 20, 'default.png'),
('Diseño Web con HTML y CSS', 'Construcción de páginas web responsivas desde cero', '6 semanas', 69990, 15, 'default.png'),
('Excel Avanzado', 'Tablas dinámicas, fórmulas avanzadas y automatización', '4 semanas', 49990, 25, 'default.png');

INSERT INTO usuarios (usuario, password) VALUES
('admin', 'admin123'),
('profesor', 'clave456');

INSERT INTO inscripciones (curso_id, nombre, email, telefono) VALUES
(1, 'Camila Soto', 'camila.soto@correo.com', '+56912345678'),
(2, 'Matías Reyes', 'matias.reyes@correo.com', '+56987654321');
