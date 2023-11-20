const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
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

    insertUsuario(nombres, apellidos, usuario, correo, pass) {
        const stmt = this.db.prepare(`
      INSERT INTO usuarios (nombres, apellidos, usuario, correo, pass)
      VALUES (?, ?, ?, ?, ?)
    `);
        stmt.run(nombres, apellidos, usuario, correo, pass);
        stmt.finalize();
    }

    getUsuarioByUsuario(usuario) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM usuarios WHERE usuario = ?',
                [usuario],
                (error, row) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;
