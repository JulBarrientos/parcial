<html>
	<head>
		<title>Env&iacute;o por POST</title>
	</head>
	<body>
		<form action="<?php echo $_SERVER["PHP_SELF"];?>" method="post">
			Nombre:<input type="text" name="txtNombre" />
			<br/>
			Edad:<input type="text" name="txtEdad" />
			<br/>
			<input type="submit" value="Enviar por POST" />
		</form>
		<br/><br/><br/>
		<?php 
			if(isset($_POST["txtNombre"]) && isset($_POST["txtEdad"]))
			{
		?>
		Su nombre es <?php echo $_POST["txtNombre"]; ?>
		y tiene <?php echo $_POST["txtEdad"]; ?> a&ntilde;os
		<?php
			}
		?>		
	</body>
</html>