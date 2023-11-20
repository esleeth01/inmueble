// Importa los módulos necesarios
const express = require('express');
const path = require('path');
const Database = require('./db/db');

// Crea una instancia de Express
const app = express();

// middleware para parsear JSON y datos codificados en la URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Puerto en el que el servidor escuchará
const httpPort = 3000;

// Configura la carpeta 'assets' como estática para servir archivos HTML y archivos estáticos desde 'node_modules'
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  extensions: ['html']
}), express.static(path.join(__dirname, 'node_modules')));

// Conecta a la base de datos SQLite utilizando la clase Database
const db = new Database('db/el_cachaco.db');

// Rutas para renderizar vistas EJS
app.get('/', (req, res) => {
  // Renderiza la vista index.ejs y envía como respuesta
  res.render('index');
});

app.get('/login', (req, res) => {
  // Renderiza la vista login.ejs y envía como respuesta
  res.render('login');
});

app.get('/politicas', (req, res) => {
  // Renderiza la vista politicas.ejs y envía como respuesta
  res.render('politicas');
});

// Ruta POST para registrar un nuevo usuario
app.post('/registrar', async (req, res) => {
  try {
    console.log(req.body);
    // Extrae los datos del cuerpo de la solicitud
    const {
      userNombres,
      userApellido,
      usuario,
      correo,
      pass
    } = req.body;

    // Valida que todos los campos necesarios estén presentes
    if (!userNombres || !userApellido || !usuario || !correo || !pass) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    // Verifica si el usuario ya existe en la base de datos
    const usuarioExistente = await db.getUsuarioByUsuario(usuario);

    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El usuario ya está registrado'
      });
    }

    // Inserta el nuevo usuario en la base de datos
    await db.insertUsuario(userNombres, userApellido, usuario, correo, pass);

    // Responde al cliente con un mensaje de éxito
    res.json({
      message: 'Usuario registrado con éxito'
    });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    // Responde con un error interno del servidor en caso de excepción
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// Crea el servidor HTTP y escucha en el puerto especificado
const httpServer = app.listen(httpPort, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${httpPort}`);
});

// Maneja la señal de cierre para cerrar la conexión a la base de datos
process.on('SIGINT', () => {
  db.close();
});
