// ./server.js

// Importa los módulos necesarios
const express = require('express');
const path = require('path');
const Database = require('./db/db');
const bcrypt = require('bcrypt');

// Crea una instancia de Express
const app = express();

// middleware para parsear JSON y datos codificados en la URL (no entiendo para que sirve, pero en los foros decian que se debia hacer asi)
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

// Agregar una ruta POST para manejar el inicio de sesión
app.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Consultar la base de datos para verificar las credenciales
    const usuarioRegistrado = await db.getUsuarioByUsuario(usuario);

    if (usuarioRegistrado) {
      // Verificar la contraseña utilizando bcrypt.compare
      const passwordMatch = await bcrypt.compare(contrasena, usuarioRegistrado.pass);

      if (passwordMatch) {
        // Credenciales correctas
        res.json({
          success: true,
          message: 'Inicio de sesión exitoso'
        });
      } else {
        // Credenciales incorrectas
        res.json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }
    } else {
      // Usuario no encontrado
      res.json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      error: 'Error interno del servidor al iniciar sesión'
    });
  }
});

// Crea el servidor HTTP y escucha en el puerto especificado
const httpServer = app.listen(httpPort, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${httpPort}`);
});

// Maneja la señal de cierre para cerrar la conexión a la base de datos
process.on('SIGINT', async () => {
  try {
    console.log('Cerrando conexión a la base de datos...');
    await db.close();
    console.log('Conexión cerrada. Saliendo del servidor.');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
    process.exit(1);
  }
});

// Maneja otras señales de cierre para cerrar la conexión a la base de datos
process.on('SIGTERM', async () => {
  try {
    console.log('Cerrando conexión a la base de datos debido a SIGTERM...');
    await db.close();
    console.log('Conexión cerrada. Saliendo del servidor debido a SIGTERM.');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
    process.exit(1);
  }
});

// Asegura que la conexión a la base de datos se cierre al cerrar la aplicación de manera inesperada
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  try {
    console.log('Cerrando conexión a la base de datos debido a unhandledRejection...');
    await db.close();
    console.log('Conexión cerrada. Saliendo del servidor debido a unhandledRejection.');
    process.exit(1);
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
    process.exit(1);
  }
});

// Asegura que la conexión a la base de datos se cierre al cerrar la aplicación de manera inesperada
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  try {
    console.log('Cerrando conexión a la base de datos debido a uncaughtException...');
    await db.close();
    console.log('Conexión cerrada. Saliendo del servidor debido a uncaughtException.');
    process.exit(1);
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos:', error);
    process.exit(1);
  }
});
