
eventListeners();
var listaProyectos = document.querySelector('#proyectos'),
    listaTareas = document.querySelector('#tareas');

function eventListeners() {

    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    })

    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();

    //Crea un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //Seleccionar el id con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //Al presionar enter crea el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;
        if(tecla === 13) {
            if(inputNuevoProyecto.value != '') {
                id_usuario = document.querySelector('.crear-proyecto a').getAttribute('href');
                guardarProyectoDB(inputNuevoProyecto.value, id_usuario);
                listaProyectos.removeChild(nuevoProyecto);
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: 'Este campo no puede ir vacio'
                  })
            }
        }
    });
}


function guardarProyectoDB(nombreProyecto, id) {

    //Crear llamado a ajax
    const xhr = new XMLHttpRequest();

    //Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    datos.append('id', id);

    //Abrir la conexion
    xhr.open('POST', 'includes/models/modelo-proyectos.php', true);

    //En la carga
    xhr.onload = function() {
        if(this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta);
            var proyecto = respuesta.nombre_proyecto,
            id_respuesta = respuesta.id_insertado,
            tipo = respuesta.tipo;

            if(respuesta.respuesta === 'correcto') {
                if(tipo === 'crear') {
                    // Se creo un nuevo proyecto
                    //Inyectar el html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_respuesta}" id="${id_respuesta}">
                            ${proyecto}
                        </a>
                    `;
                    //Agregar al html
                    listaProyectos.appendChild(nuevoProyecto);

                    //Enviar alerta
                    Swal.fire({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto ' + proyecto + ' se creo exitosamente'
                      })
                    //Redireccionar a la nueva url
                    .then(result => {
                        if(result.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_respuesta;
                        }
                    })
                

                } else {
                    // Se actualizo o se elimino
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


    xhr.send(datos);

}

//Agregar tarea
function agregarTarea(e) {
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    if(nombreTarea === '') {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'Escriba una tarea valida'
          })
    } else {
        insertarTareaDB(nombreTarea);
    }
}

function insertarTareaDB(nombre) {
    //LLamado a jax
    const xhr = new XMLHttpRequest();

    //Crear formdata
    var id_proyecto = document.querySelector('#id_proyecto').value;
    var datos = new FormData();
    datos.append('tarea', nombre);
    datos.append('accion', 'crear');
    datos.append('id_proyecto', id_proyecto);

    xhr.open("POST", 'includes/models/modelo-tareas.php', true);

    xhr.onload = function() {
        if(this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);

            //Asignar valores
            var resultado = respuesta.respuesta,
                tarea = respuesta.nombre,
                id_tarea = respuesta.id_insertado,
                tipo = respuesta.tipo

            if(resultado === 'correcto') {
                if(tipo === 'crear') {
                    Swal.fire({
                        type: 'success',
                        title: 'Correcto!',
                        text: 'La tarea: '+ tarea + ' se creo exitosamente'
                      });

                      //Retirar el parrafo de lista vacia
                      var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                      if(parrafoListaVacia.length > 0) {
                          document.querySelector('.lista-vacia').remove();
                      }


                    //Construir el template
                    var nuevaTarea = document.createElement('li');
                    nuevaTarea.id = 'tarea_' + id_tarea;
                    nuevaTarea.classList.add('tarea');

                    nuevaTarea.innerHTML = `
                        <p>${tarea}</p>
                        <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>
                        </div>
                    `;

                    //Agregarlo a la lista
                    listaTareas.appendChild(nuevaTarea);

                    //limpiar el formulario
                    document.querySelector('.agregar-tarea').reset();

                    actualizarProgreso();
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

    xhr.send(datos);
}

//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();
    
    if(e.target.classList.contains('far')) {
        if(e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    } 
    
    if(e.target.classList.contains('fas')) {
        Swal.fire({
            title: 'Estas seguro?',
            text: "La tarea se eliminara permanentemente",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;

                borrarTareaBD(tareaEliminar);

                tareaEliminar.remove();

                Swal.fire(
                    'Eliminado!',
                    'La tarea ha sido removida',
                    'success'
                  )
            }
          })
    } 
}

//Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var id_tarea = tarea.parentElement.parentElement.id.split('_')[1];
    
    //Crear llamado a ajax
    const xhr = new XMLHttpRequest();

    var datos = new FormData();
    datos.append('id', id_tarea);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    xhr.open('POST', 'includes/models/modelo-tareas.php', true);

    xhr.onload = function() {
        if(this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            actualizarProgreso();
        }
    }

    xhr.send(datos);
}

//Elimina la tarea de la bd 
function borrarTareaBD(tarea) {
    var id_tarea = tarea.id.split('_')[1];
 
    //Crear llamado a ajax
    const xhr = new XMLHttpRequest();


    xhr.open('GET', `includes/models/modelo-tareas.php?id=${id_tarea}&accion=borrar`, true);

    xhr.onload = function() {
        if(this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);

            
            var listaTareasRestantes = document.querySelectorAll('.tarea');
            if(listaTareasRestantes.length < 1) {
                document.querySelector('#tareas').innerHTML = `
                    <li class= "lista-vacia">
                        <p>Todavia no hay tareas</p>
                    </li>
                `;
            }
            actualizarProgreso();
        }
    }

    xhr.send();
}

function actualizarProgreso() {
    var totalTareas = document.querySelectorAll('.tarea').length,
        tareasCompletadas = document.querySelectorAll('.completo').length,
        avance = Math.round((tareasCompletadas * 100) / totalTareas);

        porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

    //Mostrar una alerta si esta completado
    if(porcentaje.style.width === '100%') {
        Swal.fire(
            'Proyecto terminado',
            'Ya no tienes tareas pendientes!',
            'success'
          )
    }

}