<?php 
    function conectarDB() : mysqli {
        $db = new mysqli('localhost', 'root', '', 'uptask');

        if(!$db) {
            echo "Error, no se pudo conectar";

            exit;
        }

        return $db; 
    }

/* $db = conectarDB(); */

/* $db->set_charset('utf8'); */

/* echo $db->ping(); */