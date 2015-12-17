<?php
	require_once('clases/proveedores.php');
	require_once('clases/AccesoDatos.php');
?>
<html>
<head>
	<title>Ejemplos de PDO</title>

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

       <script type="text/javascript">
		function Borrar(numero)
		{
			//alert(numero);
			document.getElementById('idparaborrar').value = numero;
			document.frmBorrar.submit();
		}
		function Modificar(numero)
		{
			//alert(numero);
			document.getElementById('idparamodificar').value = numero;
			document.frmModificar.submit();
		}
        </script>
</head>
<body>
 <a class="btn btn-info" href="index.html">Menu principal</a>
<?php
	if(isset($_POST['idparaborrar']))
	{
		//echo "Debo borrar";
		$resultado = Proveedor::Borrar($_POST['idparaborrar']);
	}
?>	
	<form name="frmBorrar" method="POST" >
		<input type="hidden" name="idparaborrar" id="idparaborrar" />
	</form>
	
	<form name="frmModificar" method="POST" action="alta.php" >
		<input type="hidden" name="idparamodificar" id="idparamodificar" />
	</form>

	<div class="container">
		<div class="page-header">
			<h1>Ejemplos de Grilla</h1>      
		</div>
		<div class="CajaInicio animated bounceInRight">
			<h1>Ejemplos PDO </h1>

<?php 

$ArrayDeProveedores = Proveedor::TraerTodosLosProveedores();

echo "<table class='table'>
		<thead>
			<tr>
				<th>  Nombre     </th>
				<th>  Domicilio  </th>
				<th>  Localidad  </th>
				<th>  BORRAR     </th>
				<th>  MODIFICAR  </th>
			</tr> 
		</thead>";   	

	foreach ($ArrayDeProveedores as $prov){

		echo " 	<tr>
					<td>".$prov->GetNombre()."</td>
					<td>".$prov->GetDomicilio()."</td>
					<td>".$prov->GetLocalidad()."</td>
					<td><button class='btn btn-danger' name='Borrar' onclick='Borrar(".$prov->GetNumero().")'>Borrar</button></td>
					<td><button class='btn btn-warning' name='Modificar' onclick='Modificar(".$prov->GetNumero().")'>Modificar</button></td>
				</tr>";
	}	
echo "</table>";		
?>
		</div>
	</div>
</body>
</html>