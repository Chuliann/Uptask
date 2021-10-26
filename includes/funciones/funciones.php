<?php


function obtenerPaginaActual() {
    $archivo = basename($_SERVER['PHP_SELF']);
    $pagina = str_replace('.php', '', $archivo);
    return $pagina;
}

function debuguear($var, $si = false) {
    echo '<pre>';
    var_dump($var);
    echo '</pre>';

    if($si) {
        exit;
    }
} 

function obtenerProyectos($db, $id) {
    try {
        return $db->query("SELECT * FROM proyectos WHERE id_usuario = " . $id);
    } catch (Exception $e) {
        echo "Error!" . $e->getMessage();
        return false;
    }
    
}

function obtenerLasTareas($db, $id) {
    $query = "SELECT id, nombre, estado FROM tareas WHERE id_proyecto = " . $id;
    return $db->query($query);

}

function obtenerNombreProyecto($db, $id) {
    $proyecto = $db->query("SELECT * FROM proyectos WHERE id = " . $id); // = {$id}
    return $proyecto->fetch_assoc();  
}
  
