function registrarUsuario() {
    // Obtener valores de los campos del formulario
    var nombres = document.getElementById('userNombresRegistro').value;
    var apellidos = document.getElementById('userApellidoRegistro').value;
    var usuario = document.getElementById('userRegistro').value;
    var correo = document.getElementById('emailRegistro').value;
    var contraseña = document.getElementById('passwordRegistro').value;
    var contraseña2 = document.getElementById('passwordRegistro2').value;
    // Verificar si las contraseñas coinciden
    if (contraseña !== contraseña2) {
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
            contraseña: contraseña
        })
    }).then(response => response.json()).then(data => {
        // Manejar la respuesta del servidor
        console.log(data);
        // Puedes redirigir al usuario a otra página o realizar otras acciones según sea necesario
    }).catch(error => {
        console.error('Error al registrar el usuario:', error);
        // Manejar errores
    });
}