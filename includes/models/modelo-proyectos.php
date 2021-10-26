<?php
include '../funciones/funciones.php';
include '../funciones/db.php';
$db = conectarDB();

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];
$id = $_POST['id'];

if ($accion === 'crear') {
    //Codigo para crear los proyectos

    try {
        $stmt = $db->prepare("INSERT INTO proyectos (nombre, id_usuario) VALUES (?, ?)");
        $stmt->bind_param('si', $proyecto, $id);
        $stmt->execute();

        //$stmt->error, $stmt->error_list

        if ($stmt->affected_rows > 0) { //Chequear que efectivamente se realizo la consulta
            $respuesta = [
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
            ];
        } else {
            $respuesta = [
                'respuesta' => 'error'
            ];
        }

        $stmt->close();
        $db->close();
    } catch (Exception $e) {
        $respuesta = [
            'error' => $e->getMessage()
        ];
    }



    echo json_encode($respuesta);
}
