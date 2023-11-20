// Importa la biblioteca sqlite3 y obtiene la interfaz verbose
const sqlite3 = require('sqlite3').verbose();
// Definición de la clase Database
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
                contraseña TEXT
            )
        `);
    }
    // Método para insertar un nuevo usuario en la tabla 'usuarios'
    insertUsuario(nombres, apellidos, usuario, correo, contraseña) {
        // Prepara la consulta SQL con placeholders (?)
        const stmt = this.db.prepare(`
            INSERT INTO usuarios (nombres, apellidos, usuario, correo, contraseña)
            VALUES (?, ?, ?, ?, ?)
        `);
        // Ejecuta la consulta con los valores proporcionados
        stmt.run(nombres, apellidos, usuario, correo, contraseña);
        // Finaliza la declaración (libera recursos)
        stmt.finalize();
    }
    // Método para cerrar la conexión a la base de datos
    close() {
        this.db.close();
    }
}
// Exporta la clase Database para que pueda ser utilizada en otros módulos
module.exports = Database;