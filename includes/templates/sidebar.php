<?php 
    $id_usuario = $_SESSION['id'];
    $proyectos = obtenerProyectos($db, $id_usuario);
?>
<aside class="contenedor-proyectos">
    <div class="panel crear-proyecto">
        <a href="<?php echo $_SESSION['id'] ?>" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
    </div>

    <div class="panel lista-proyectos">
        <h2>Proyectos</h2>
        <ul id="proyectos">
            <?php foreach($proyectos as $proyecto): ?>
            <li>
                <a href="index.php?id_proyecto=<?php echo $proyecto['id'] ?>" id="proyecto_<?php echo $proyecto['id'] ?>">
                    <?php echo $proyecto['nombre']; ?>
                </a>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
</aside>