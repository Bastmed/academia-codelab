# Academia CodeLab

Sistema web de gestión de cursos y inscripciones para una academia de tecnología. Permite a los visitantes ver los cursos disponibles e inscribirse, y a los administradores gestionar cursos e inscripciones desde un panel privado.

---

## Integrantes del grupo

### Ángel Meneses — Frontend / Vistas
- `public/index.html` — Página pública principal: navbar, hero section, sección de cursos con carga dinámica desde la API, sección "Nosotros" con estadísticas, sección de contacto, footer y modal de inscripción.
- `public/css/estilos.css` — Identidad visual completa: tipografías (Poppins/Inter), gradiente hero, cards de cursos con efecto hover, stat-boxes y paleta de colores corporativa azul/amarillo.
- `views/admin/panel.html` — Vista del panel de administración: formulario de agregar/editar cursos, tabla de cursos con botones de acción, y tabla de inscripciones recibidas.
- `views/public/login.html` — Formulario de inicio de sesión con diseño centrado en card Bootstrap y enlace de retorno al sitio.

### Bastián Meneses — Backend / Lógica del cliente
- `server.js` — Configuración del servidor Express: middlewares para JSON y archivos estáticos, registro de las 3 rutas principales (auth, cursos, inscripciones) y arranque en el puerto 3000.
- `public/js/inicio.js` — Lógica del sitio público: carga dinámica de cursos desde la API, renderizado de cards con cupos y precio, y manejo completo del modal de inscripción con envío al endpoint `/api/inscripciones`.
- `public/js/panel.js` — Lógica del panel admin: recarga dinámica de la tabla de cursos, operaciones CRUD completas (agregar, editar, eliminar) vía fetch a la API REST, y carga de la tabla de inscripciones recibidas.
- `public/js/login.js` — Validación del formulario de login en el cliente: previene el envío si los campos están vacíos.

### Franco Ortiz — Backend / API REST y rutas
- `controllers/authController.js` — Lógica de autenticación: renderizado del login con inyección dinámica de mensajes de error, validación de credenciales contra la base de datos y redirección al panel si el login es exitoso.
- `controllers/cursoController.js` — CRUD completo de cursos: listar, agregar, editar y eliminar vía queries SQL, más la función `mostrarPanel` que renderiza el HTML del panel con las filas precargadas desde la BD.
- `controllers/inscripcionController.js` — Lógica de inscripciones: registro de nuevos alumnos con validación de campos, y listado con JOIN entre `inscripciones` y `cursos` ordenado por fecha.
- `routes/auth.js` — Rutas GET y POST para `/login`.
- `routes/cursos.js` — Rutas REST para `/api/cursos` (GET, POST, PUT, DELETE) y `/admin/panel`.
- `routes/inscripciones.js` — Rutas GET y POST para `/api/inscripciones`.

---

## Descripción del proyecto

**Academia CodeLab** es un sistema web de gestión para una academia de tecnología. Resuelve la necesidad de publicar cursos disponibles al público y recibir inscripciones en línea, mientras permite a los administradores gestionar el catálogo de cursos y revisar las inscripciones recibidas desde un panel privado con acceso por credenciales.

---

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [XAMPP](https://www.apachefriends.org/) o [Bitnami WAMP](https://bitnami.com/stack/wamp) (para el servidor MySQL)
- Git (para clonar el repositorio)

---

## Instalación paso a paso

**1. Clonar el repositorio**
```bash
git clone https://github.com/Bastmed/academia-codelab.git
cd academia-codelab
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Importar la base de datos**

- Inicia XAMPP y activa el servicio **MySQL**
- Abre **phpMyAdmin** en `http://localhost/phpmyadmin`
- Crea una base de datos llamada `academia_codelab`
- Selecciónala e importa el archivo `database.sql` desde la raíz del proyecto

**4. Ejecutar el servidor**
```bash
node server.js
```

**5. Abrir en el navegador**
```
http://localhost:3000
```

---

## Configuración de la base de datos

El archivo de conexión se encuentra en `config/db.js`. Los valores usados en el proyecto son:

| Parámetro  | Valor             |
|------------|-------------------|
| Host       | `localhost`       |
| Usuario    | `root`            |
| Contraseña | *(vacía)*         |
| Base de datos | `academia_codelab` |



## Credenciales de prueba

Para acceder al panel de administración en `/login`:

| Usuario    | Contraseña |
|------------|------------|
| `admin`    | `admin123` |
| `profesor` | `clave456` |

---

## Uso del sistema

**Sitio público** — `http://localhost:3000`
- Visualiza los cursos disponibles con precio, duración y cupos
- Haz clic en **"Reservar cupo"** para inscribirte en un curso mediante el modal

**Login de administración** — `http://localhost:3000/login`
- Ingresa con una de las credenciales de prueba para acceder al panel

**Panel de administración** — `http://localhost:3000/admin/panel`
- **Agregar** nuevos cursos completando el formulario y haciendo clic en "Guardar"
- **Editar** un curso existente haciendo clic en el botón "Editar" de la tabla
- **Eliminar** un curso con el botón "Eliminar" (se pide confirmación)
- **Ver inscripciones** recibidas en la tabla inferior del panel

---

## Estructura del proyecto

```
academia-codelab/
├── config/
│   └── db.js                  # Configuración de conexión a MySQL
├── controllers/
│   ├── authController.js      # Lógica de login y renderizado del formulario
│   ├── cursoController.js     # CRUD de cursos y renderizado del panel
│   └── inscripcionController.js # Registro y listado de inscripciones
├── model/
│   └── Curso.js               # Clase modelo del curso
├── public/
│   ├── css/
│   │   └── estilos.css        # Estilos globales e identidad visual
│   ├── js/
│   │   ├── inicio.js          # Lógica del sitio público y modal de inscripción
│   │   ├── panel.js           # Lógica del panel admin (CRUD + inscripciones)
│   │   └── login.js           # Validación del formulario de login
│   └── index.html             # Página pública principal
├── routes/
│   ├── auth.js                # Rutas de autenticación (/login)
│   ├── cursos.js              # Rutas de cursos (/api/cursos, /admin/panel)
│   └── inscripciones.js       # Rutas de inscripciones (/api/inscripciones)
├── views/
│   ├── admin/
│   │   └── panel.html         # Vista HTML del panel de administración
│   └── public/
│       └── login.html         # Vista HTML del formulario de login
├── database.sql               # Script SQL para crear e importar la base de datos
├── server.js                  # Punto de entrada del servidor Express
└── package.json               # Dependencias y scripts del proyecto
```
