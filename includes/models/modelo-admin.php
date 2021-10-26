<?php

include '../funciones/db.php';
include '../funciones/funciones.php';
$db = conectarDB();

$accion = $_POST['accion'];
$usuario = $_POST['usuario'];
$password = $_POST['password'];

if ($accion === 'crear') {
    //Codigo para crear los administradores

    //Hashear el password
    $opciones = [
        'cost' => 12
    ];

    $password_h = password_hash($password, PASSWORD_BCRYPT, $opciones);

    try {
        $stmt = $db->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
        $stmt->bind_param('ss', $usuario, $password_h);
        $stmt->execute();

        //$stmt->error, $stmt->error_list

        if ($stmt->affected_rows > 0) { //Chequear que efectivamente se realizo la consulta
            $respuesta = [
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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



if ($accion === 'login') {
    //Codigo para loguear a un admin

    try {
        //Seleccionar al admin de la bd
        $stmt = $db->prepare("SELECT id, usuario, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        //Loguear al usuario
        $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
        $stmt->fetch();
        if($nombre_usuario) {
            //El usuario existe
            if(password_verify($password, $pass_usuario)) {
                //Login correcto
                //Iniciar sesion
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['login'] = true;
                $_SESSION['id'] = $id_usuario;
                $respuesta = [
                    'tipo' => $accion,
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario
                ];
            } else {
                //Login incorrecto
                $respuesta = [
                    'respuesta' => 'Password Incorrecto'
                ];
            }
           
        } else {
            $respuesta = [
                'error' => 'Usuario no existe'
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
