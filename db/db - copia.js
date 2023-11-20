// Importa la biblioteca sqlite3 para interactuar con la base de datos SQLite
const sqlite3 = require('sqlite3').verbose();
// Importa la biblioteca bcrypt para el hash seguro de contraseñas
const bcrypt = require('bcrypt');

// Definición de la clase Database para interactuar con la base de datos
class Database {
    // Constructor de la clase que recibe la ruta de la base de datos
    constructor(dbPath) {
        // Inicializa una instancia de la base de datos sqlite3
        this.db = new sqlite3.Database(dbPath);
        // Llama al método init para inicializar la base de datos (crear tabla si no existe)
        this.init();
    }

    // Método para inicializar la base de datos
    init() {
        // Crea la tabla 'usuarios' si no existe
        this.db.run(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombres TEXT,
            apellidos TEXT,
            usuario TEXT,
            correo TEXT,
            pass TEXT
          )
        `);
    }

    // Método asincrónico para insertar un nuevo usuario en la tabla 'usuarios'
    async insertUsuario(nombres, apellidos, usuario, correo, pass) {
        // Genera un hash seguro de la contraseña utilizando bcrypt
        const hashedPass = await bcrypt.hash(pass, 10);

        // Prepara la consulta SQL con placeholders (?)
        const stmt = this.db.prepare(`
          INSERT INTO usuarios (nombres, apellidos, usuario, correo, pass)
          VALUES (?, ?, ?, ?, ?)
        `);
        // Ejecuta la consulta con los valores proporcionados y la contraseña hasheada
        stmt.run(nombres, apellidos, usuario, correo, hashedPass);
        // Finaliza la declaración (libera recursos)
        stmt.finalize();
    }

    // Método asincrónico para obtener un usuario por nombre de usuario
    async getUsuarioByUsuario(usuario) {
        // Retorna una promesa para manejar la consulta asíncrona
        return new Promise((resolve, reject) => {
            // Realiza una consulta para obtener un usuario por su nombre de usuario
            this.db.get(
                'SELECT * FROM usuarios WHERE usuario = ?',
                [usuario],
                (error, row) => {
                    // Maneja posibles errores o resuelve la promesa con el resultado
                    if (error) {
                        reject(error);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    // Método para cerrar la conexión a la base de datos
    close() {
        this.db.close();
    }
}

// Exporta la clase Database para que pueda ser utilizada en otros módulos
module.exports = Database;