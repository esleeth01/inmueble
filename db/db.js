// db/db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

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

    async insertUsuario(nombres, apellidos, usuario, correo, pass) {
        const hashedPass = await bcrypt.hash(pass, 10);
        const stmt = this.db.prepare(`
            INSERT INTO usuarios (nombres, apellidos, usuario, correo, pass)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(nombres, apellidos, usuario, correo, hashedPass);
        stmt.finalize();
    }

    async getUsuarioByUsuario(usuario) {
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
