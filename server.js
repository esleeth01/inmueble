// server.js
const express = require('express');
const path = require('path');
const Database = require('./db/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const httpPort = 80;

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  extensions: ['html']
}), express.static(path.join(__dirname, 'node_modules')));

const db = new Database('db/el_cachaco.db');

const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', indexRoutes);
app.use('/users', userRoutes);

const httpServer = app.listen(httpPort, () => {
  console.log(`Servidor HTTP escuchando en http://localhost:${httpPort}`);
});

process.on('SIGINT', () => {
  db.close();
});
