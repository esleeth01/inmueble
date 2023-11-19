// Importar los módulos necesarios
const express = require('express');
const path = require('path');

// Crear una instancia de Express
const app = express();

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Puerto en el que el servidor escuchará
const httpPort = 80;

// Configurar la carpeta 'assets' para que sea estática
app.use('/assets', express.static(path.join(__dirname, 'assets'), { extensions: ['html'] }), express.static(path.join(__dirname, 'node_modules')));

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

// Crear el servidor HTTP y escuchar en el puerto especificado
const httpServer = app.listen(httpPort, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${httpPort}`);
});
