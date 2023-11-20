// controllers/userController.js
const db = require('../db/db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { userNombres, userApellido, usuario, correo, pass } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userNombres || !userApellido || !usuario || !correo || !pass || !emailRegex.test(correo)) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios y el correo debe ser válido'
            });
        }

        const usuarioExistente = await db.getUsuarioByUsuario(usuario);

        if (usuarioExistente) {
            return res.status(400).json({
                error: 'El usuario ya está registrado'
            });
        }

        const hashedPass = await bcrypt.hash(pass, 10);
        await db.insertUsuario(userNombres, userApellido, usuario, correo, hashedPass);

        res.json({
            message: 'Usuario registrado con éxito'
        });
    } catch (error) {
        console.log(error);
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor al registrar el usuario'
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        const usuarioRegistrado = await db.getUsuarioByUsuario(usuario);

        if (usuarioRegistrado && await bcrypt.compare(contrasena, usuarioRegistrado.pass)) {
            res.json({
                success: true,
                message: 'Inicio de sesión exitoso'
            });
        } else {
            res.json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            error: 'Error interno del servidor al iniciar sesión'
        });
    }
};
