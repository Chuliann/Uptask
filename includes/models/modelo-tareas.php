<?php 

include '../funciones/db.php';
$db = conectarDB();

if($_POST) {
    $accion = $_POST['accion'];
} else {
    $accion = $_GET['accion'];
}


if($accion === 'crear') {
    
    
    $id_proyecto = (int) $_POST['id_proyecto'];
    $nombre = $_POST['tarea'];

    try {
        $stmt = $db->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
        $stmt->bind_param("si", $nombre, $id_proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = [
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre' => $nombre
            ];
        } else {
            $respuesta = [
                'respuesta' => 'error'
            ];
        }
        $stmt->close();
        $db->close();
    } catch(Exception $e) {
        return $respuesta = [
            'error' => $e->getMessage()
        ];
    }
    
    echo json_encode($respuesta);
}

if($accion === 'actualizar') {
    $id_tarea = (int) $_POST['id'];
    $estado = (int) $_POST['estado'];

    try {
        $stmt = $db->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
        $stmt->bind_param("ii", $estado, $id_tarea);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = [
                'respuesta' => 'correcto'
            ];
        } else {
            $respuesta = [
                'respuesta' => 'error'
            ];
        }

        $stmt->close();
        $db->close();
    } catch (Exception $e) {
        $respuesta = ['error' => $e->getMessage()];
    }
    
    echo json_encode($respuesta);
}



if($accion === 'borrar') {

    $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmt = $db->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        if($stmt->affected_rows == 1) {
            $respuesta = [
                'respuesta' => 'correcto'
            ];
        }
        $stmt->close();
        $db->close();

    } catch(Exception $e) {
        $respuesta = [
            'error' => $e->getMessage()
        ];
    }

    echo json_encode($respuesta);
}
