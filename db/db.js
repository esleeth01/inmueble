const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
        // Crea la tabla si no existe
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

    insertUsuario(nombres, apellidos, usuario, correo, contraseña) {
        const stmt = this.db.prepare(`
            INSERT INTO usuarios (nombres, apellidos, usuario, correo, contraseña)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(nombres, apellidos, usuario, correo, contraseña);
        stmt.finalize();
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;
