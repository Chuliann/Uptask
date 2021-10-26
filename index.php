<?php 
    include 'includes/funciones/db.php'; 
    include 'includes/funciones/sesiones.php';
    include 'includes/funciones/funciones.php'; 
    include 'includes/templates/header.php'; 
    include 'includes/templates/barra.php';

    $db = conectarDB();
    $db->set_charset('utf8');

    if(isset($_GET['id_proyecto'])) {
        $id = $_GET['id_proyecto'];
        $proyectoActual = obtenerNombreProyecto($db, $id);
    } else {
        $id = null;
    }

?>


<div class="contenedor">
    
    <?php include 'includes/templates/sidebar.php'; ?>

    <main class="contenido-principal">
        
        <h1>
            <span><?php echo (isset($proyectoActual['nombre'])) ? $proyectoActual['nombre'] : 'Elija un proyecto'; ?></span>
        </h1>

        <form action="#" class="agregar-tarea">
            <div class="campo">
                <label for="tarea">Tarea:</label>
                <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
            </div>
            <div class="campo enviar">
                <input type="hidden" id="id_proyecto" value="<?php echo $id ?>">
                <input type="submit" class="boton nueva-tarea" value="Agregar">
            </div>
        </form>
        
 

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul id="tareas">
            <?php 
                if(isset($id)) {
                    $tareas = obtenerLasTareas($db, $id); 
                    if($tareas->num_rows > 0) { ?>
                    <?php foreach($tareas as $tarea): ?>
                        <li id="tarea_<?php echo $tarea['id'] ?>" class="tarea">
                            <p><?php echo $tarea['nombre'] ?></p>
                            <div class="acciones">
                                <i class="far fa-check-circle<?php echo ($tarea['estado'] === '1') ? ' completo' : '' ?>"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        </li>  
                    <?php endforeach; ?>
                    <?php } else { ?>
                        <li class="lista-vacia">
                            <p>Todavia no hay tareas</p>
                        </li>
                    <?php } ?>
                <?php } else { ?>
                    <li class="lista-vacia">
                        <p>Seleccione un proyecto</p>
                    </li>
                <?php } ?>
            </ul>
        </div>

        <div class="avance">
            <h2>Avance del proyecto:</h2>
            <div id="barra-avance" class="barra-avance">
                <div id="porcentaje" class="porcentaje"></div>
            </div>
        </div>

    </main>
</div><!--.contenedor-->





<?php include 'includes/templates/footer.php'; ?>