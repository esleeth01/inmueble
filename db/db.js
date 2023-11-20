const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos (o crearla si no existe)
const db = new sqlite3.Database('db/el_cachaco.db');

// Crear una tabla de usuarios
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombres TEXT, apellidos TEXT, usuario TEXT, correo TEXT, contraseña TEXT)');

    // Insertar un usuario de ejemplo
    const stmt = db.prepare('INSERT INTO usuarios (nombres, apellidos, usuario, correo, contraseña) VALUES (?, ?, ?, ?, ?)');
    stmt.run('John', 'Doe', 'john_doe', 'john@example.com', 'hashed_password');
    stmt.finalize();

    // Consultar y mostrar todos los usuarios
    db.each('SELECT * FROM usuarios', (err, row) => {
        console.log(`${row.id}: ${row.nombres} ${row.apellidos} - ${row.usuario} - ${row.correo} - ${row.contraseña}`);
    });
});

// Cerrar la conexión a la base de datos al finalizar
db.close();
