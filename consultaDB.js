const sqlite3 = require('sqlite3').verbose();

// Obtén el nombre de la tabla desde los argumentos de la línea de comandos
const tabla = process.argv[2];

if (!tabla) {
    console.error('Por favor, proporciona el nombre de la tabla como argumento.');
    process.exit(1);
}

// Conecta a la base de datos SQLite
const dbPath = './db/el_cachaco.db';
const db = new sqlite3.Database(dbPath);

// Realiza la consulta y muestra los resultados
const query = `SELECT * FROM ${tabla}`;
db.all(query, (err, rows) => {
    if (err) {
        console.error('Error al realizar la consulta:', err);
    } else {
        console.log(`Registros de la tabla ${tabla}:`);
        console.table(rows);
    }

    // Cierra la conexión a la base de datos
    db.close();
});
