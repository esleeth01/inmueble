// Importar los módulos necesarios
const express = require('express');
const path = require('path');
const Database = require('./db/db'); // Database
// Crear una instancia de Express
const app = express();
// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Puerto en el que el servidor escuchará
const httpPort = 3000;
// Configurar la carpeta 'assets' para que sea estática
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  extensions: ['html']
}), express.static(path.join(__dirname, 'node_modules')));
// Conecta a la base de datos
const db = new Database('db/el_cachaco.db');
// Ruta para renderizar la vista index.ejs cuando alguien accede a '/'
app.get('/', (req, res) => {
  // Renderizar la vista index.ejs y enviarla como respuesta
  res.render('index');
});
// Ruta para renderizar la vista login.ejs cuando alguien accede a '/'
app.get('/login', (req, res) => {
  // Renderizar la vista login.ejs y enviarla como respuesta
  res.render('login');
});
// Ruta para renderizar la vista politicas.ejs cuando alguien accede a '/politicas'
app.get('/politicas', (req, res) => {
  // Renderizar la vista policitas.ejs y enviarla como respuesta
  res.render('politicas');
});
app.post('/registrar', async (req, res) => {
  try {
    const {
      userNombres,
      userApellido,
      usuario,
      correo,
      contraseña
    } = req.body;
    // Validar que todos los campos necesarios estén presentes
    if (!userNombres || !userApellido || !usuario || !correo || !contraseña) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }
    // Realizar cualquier validación adicional según tus requisitos
    // Verificar si el usuario ya existe en la base de datos (puedes agregar esta lógica según sea necesario)
    const usuarioExistente = await db.getUsuarioByUsuario(usuario);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El usuario ya está registrado'
      });
    }
    // Aquí deberías llamar al método insertUsuario de tu instancia de Database
    await db.insertUsuario(userNombres, userApellido, usuario, correo, contraseña);
    // Responder al cliente con un mensaje de éxito
    res.json({
      message: 'Usuario registrado con éxito'
    });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});
// Crear el servidor HTTP y escuchar en el puerto especificado
const httpServer = app.listen(httpPort, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${httpPort}`);
});
// Maneja la señal de cierre para cerrar la conexión a la base de datos
process.on('SIGINT', () => {
  db.close();
  httpServer.close();
  process.exit();
});