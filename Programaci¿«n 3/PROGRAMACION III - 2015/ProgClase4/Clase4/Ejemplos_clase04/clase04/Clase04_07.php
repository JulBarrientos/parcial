<html>
	<head>
		<title>Env&iacute;o por GET</title>
	</head>
	<body>
		<form action="Clase04_06.php" method="get">
			Nombre:<input type="text" name="txtNombre" />
			<br/>
			Edad:<input type="text" name="txtEdad" />
			<br/>
			<input type="submit" value="Enviar por GET" />
		</form>
		<br/><br/><br/>
		<?php 
			if(isset($_GET["txtNombre"]) && isset($_GET["txtEdad"]))
			{
		?>
		Su nombre es <?php echo $_GET["txtNombre"]; ?>
		y tiene <?php echo $_GET["txtEdad"]; ?> a&ntilde;os
		<?php
			}
		?>
	</body>
</html>