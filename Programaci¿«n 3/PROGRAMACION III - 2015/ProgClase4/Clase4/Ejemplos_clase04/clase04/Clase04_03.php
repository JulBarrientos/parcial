<?php 
require "funciones.php";
?>
<html>
	<head>
		<title>Incluir - Requerir Archivos en PHP</title>
	</head>
	<body>	
	<?php
		include "cabecera.html";

		Saludar();
		echo "<br/>";
		
		Saludar2("Juan");
		echo "<br/>";
		
		echo Saludar3("Rosa", "Femenino");
		echo "<br/>";

		echo Saludar3("Carlos");
		echo "<br/>";
		
		?>		
		<br/>
		<p>M&aacute;s c&oacute;digo....</p>
	</body>
</html>