function registrarUsuario() {
    // Obtener valores de los campos del formulario
    var nombres = document.getElementById('userNombresRegistro').value;
    var apellidos = document.getElementById('userApellidoRegistro').value;
    var usuario = document.getElementById('userRegistro').value;
    var correo = document.getElementById('emailRegistro').value;
    var key = document.getElementById('passwordRegistro').value;
    var key2 = document.getElementById('passwordRegistro2').value;
    // Verificar si las contraseñas coinciden
    if (key !== key2) {
        alert('Las contraseñas no coinciden');
        return;
    }
    // Realizar la solicitud al servidor para registrar el usuario
    fetch('/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userNombres: nombres,
            userApellido: apellidos,
            usuario: usuario,
            correo: correo,
            pass: key
        })
    }).then(response => response.json()).then(data => {
        // Manejar la respuesta del servidor
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Registro exitoso: ' + data.message);
            // Puedes redirigir al usuario a otra página o realizar otras acciones según sea necesario
        }
    }).catch(error => {
        console.error('Error al registrar el usuario:', error);
        alert('Error interno del servidor al registrar el usuario');
        // Manejar errores
    });
}

function loginUsuario() {
    // Obtener valores de los campos del formulario
    var usuario = document.getElementById('userLogin').value;
    var contrasena = document.getElementById('passwordLogin').value;
    // Realizar la solicitud al servidor para autenticar el usuario
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            contrasena: contrasena
        })
    }).then(response => response.json()).then(data => {
        // Manejar la respuesta del servidor
        if (data.error) {
            alert('Error: ' + data.error);
        } else if (data.success) {
            alert('Inicio de sesión exitoso: ' + data.message);
            // Puedes redirigir al usuario a otra página o realizar otras acciones según sea necesario
        } else {
            alert('Credenciales incorrectas');
        }
    }).catch(error => {
        console.error('Error al iniciar sesión:', error);
        alert('Error interno del servidor al iniciar sesión');
        // Manejar errores
    });
}