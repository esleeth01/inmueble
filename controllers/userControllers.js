// userController.js
const db = require('../db/db');

exports.registerUser = async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const {
            userNombres,
            userApellido,
            usuario,
            correo,
            pass
        } = req.body;

        // Valida que todos los campos necesarios estén presentes
        if (!userNombres || !userApellido || !usuario || !correo || !pass) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        // Verifica si el usuario ya existe en la base de datos
        const usuarioExistente = await db.getUsuarioByUsuario(usuario);

        if (usuarioExistente) {
            return res.status(400).json({
                error: 'El usuario ya está registrado'
            });
        }

        // Inserta el nuevo usuario en la base de datos
        await db.insertUsuario(userNombres, userApellido, usuario, correo, pass);

        // Responde al cliente con un mensaje de éxito
        res.json({
            message: 'Usuario registrado con éxito'
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        // Responde con un error interno del servidor en caso de excepción
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

exports.loginUser = async (req, res) => {
    // código existente para iniciar sesión
};
