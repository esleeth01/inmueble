const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos (o crearla si no existe)
const db = new sqlite3.Database('mi_base_de_datos.db');

// Crear una tabla de usuarios
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT)');

  // Insertar un usuario de ejemplo
  const stmt = db.prepare('INSERT INTO usuarios (nombre, email) VALUES (?, ?)');
  stmt.run('John Doe', 'john@example.com');
  stmt.finalize();

  // Consultar y mostrar todos los usuarios
  db.each('SELECT * FROM usuarios', (err, row) => {
    console.log(`${row.id}: ${row.nombre} - ${row.email}`);
  });
});

// Cerrar la conexión a la base de datos al finalizar..........
db.close();
