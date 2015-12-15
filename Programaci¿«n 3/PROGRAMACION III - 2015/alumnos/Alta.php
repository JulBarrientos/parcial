<html>
<head>
  <title>Ejemplos de PDO</title>

    
    <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--final de Estilos-->
       <meta name="viewport" content="width=device-width, initial-scale=1">
          <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

        <!-- jQuery library -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

        <!-- Latest compiled JavaScript -->
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        <link rel="stylesheet" type="text/css" href="estilo.css">
</head>
<body>
  <div class="container">
    <div class="page-header">
            <h1>Ejemplos de PHP</h1>      
        </div>
    <div class="CajaInicio animated bounceInRight">
      <h1>Alta CD </h1>
      <form id="FormAlta" method="POST">
        
        <input type="text" name="cantante" placeholder="Cantante"></input>
        <br/>
        
        <input type="text" name="titulo" placeholder="Titulo"></input>
        <br/>

        <select name="anio" placeholder="Año">
          <?php
            for($i = 0; $i < 10; $i++) {
              echo "<option>200".$i."</option>";
            }
            echo "<option>2010</option>";
          ?>
          
        </select>
        <br/>
        <input type="submit" class="btn btn-danger"></input>
      </form>
    </div>
  </div>
</body>
<?php
/*
  if(isset($_POST['cantante'])) {
    var_dump($_POST);
  }
*/
  if(isset($_POST['cantante']) 
    && isset($_POST['titulo']) 
    && isset($_POST['anio'])) {
    
    require_once("/clases/cd.php");
    require_once("/clases/AccesoDatos.php");

    $miCD = new CD();

    $miCD->cantante = $_POST['cantante'];
    $miCD->titulo = $_POST['titulo'];
    $miCD->año = $_POST['anio'];

    $ultimoID=$miCD->InsertarElCd();

    echo "Ultimo ID = ".$ultimoID;
  }






?>
</html>