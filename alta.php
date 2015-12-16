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
	<a class="btn btn-info" href="index.html">Menu principal</a>
<?php     
	require_once("clases\proveedores.php");
	require_once("clases\AccesoDatos.php");

	if(isset($_POST['idparamodificar'])) //viene de la grilla
	{
		$unProveedor = Proveedor::TraerUnProveedorPorNumero($_POST['idparamodificar']);
		//echo "Modificar";
	} 
?>
	<div class="container">
		<div class="page-header">
			<h1>Ejemplos de PHP</h1>      
		</div>
		<div class="CajaInicio animated bounceInRight">
			<h1>Ejemplos PDO </h1>

			<form id="FormIngreso" method="post">
				<input type="text" name="numero" placeholder="ingrese número" value="<?php echo isset($unProveedor) ?  $unProveedor->GetNumero() : "" ; ?>" />
				<input type="text" name="nombre" placeholder="ingrese nombre" value="<?php echo isset($unProveedor) ?  $unProveedor->GetNombre() : "" ; ?>" />
				<input type="text" name="domicilio" placeholder="ingrese dirección" value="<?php echo isset($unProveedor) ?  $unProveedor->GetDomicilio() : "" ; ?>" />
				<input type="text" name="localidad" placeholder="ingrese localidad" value="<?php echo isset($unProveedor) ?  $unProveedor->GetLocalidad() : "" ; ?>" />

				<input type="hidden" name="numeroModif" value="<?php echo isset($unProveedor) ? $unProveedor->GetNumero() : "" ; ?>" />

				<input type="submit" class="btn btn-danger" name="guardar" />
				</div>

			</form>
		
<?php 

if(isset($_POST['guardar']))// si esto no se cumple ingreso por primera vez.
{

//	echo "numero= ".$_POST['numero'].'<br/>';

	if($_POST['numeroModif'] != "")//paso por grilla y luego guardo
	{
		$unProveedor = Proveedor::TraerUnProveedorPorNumero($_POST['numero']);
		$unProveedor->SetNumero($_POST['numero']);
		$unProveedor->SetNombre($_POST['nombre']);
		$unProveedor->SetDomicilio($_POST['domicilio']);
		$unProveedor->SetLocalidad($_POST['localidad']);
		
		$retorno = $unProveedor->Modificar();

		//echo "Modificar ".$retorno;
	}
	else// si es un alta
	{
		$prov = new Proveedor();	
		$prov->SetNumero($_POST['numero']);
		$prov->SetNombre($_POST['nombre']);
		$prov->SetDomicilio($_POST['domicilio']);
		$prov->SetLocalidad($_POST['localidad']);
		$prov->Insertar();
		
		//echo "Insertar";			
	}	
}
/*
else
{
	echo "Primer ingreso";
}
*/
?>
		</div>
	</div>
</body>
</html>