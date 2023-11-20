const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

// Crear una interfaz de lectura de la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Preguntar al usuario si realmente quiere resetear la base de datos
rl.question('¿Estás seguro de que deseas resetear la base de datos? (s/n): ', (answer) => {
  // Cerrar la interfaz de lectura
  rl.close();

  // Si la respuesta es 's' o 'S', proceder con el reset
  if (answer.toLowerCase() === 's') {
    // Conectar a la base de datos (o crearla si no existe)
    const db = new sqlite3.Database('./db/el_cachaco.db');

    // Limpiar la tabla de usuarios eliminando todos los registros
    db.run('DELETE FROM usuarios', (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Base de datos limpiada. Todos los usuarios han sido eliminados.');
      }

      // Cerrar la conexión a la base de datos al finalizar
      db.close();
    });
  } else {
    console.log('Operación cancelada. La base de datos no fue reseteada.');
  }
});
