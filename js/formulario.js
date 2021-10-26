
eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;


    if(usuario === '' || password === '') {
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
          })
    } else {
        //Ambos campos son correctos, ejecutar ajax

        //Datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);
        /* console.log(datos.get('usuario')); */

        //AJAX
        //Crear el objeto
        const xhr = new XMLHttpRequest();

        //Abrir la conexcion
        xhr.open("POST", "includes/models/modelo-admin.php", true);

        //Retorno de datos
        xhr.onload = function() {
            if(this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                if(respuesta.respuesta === 'correcto') {

                    //Si es un nuevo usuario
                    if(respuesta.tipo === 'crear') {
                        Swal.fire({
                            type: 'success',
                            title: 'Usuario Creado!',
                            text: 'El usuario se creo correctamente'
                          })
                          .then(result => {
                              if(result.value) {
                                window.location.href = "login.php"
                              }
                          })
                    } else if(respuesta.tipo === 'login') {
                        Swal.fire({
                            type: 'success',
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard'
                          })
                        .then(result => {
                            if(result.value) {
                                window.location.href = 'index.php'
                            }
                        })
                        
                    }
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                      })
                }
            }
        }

        //Enviar la peticion
        xhr.send(datos);


    }
    

}