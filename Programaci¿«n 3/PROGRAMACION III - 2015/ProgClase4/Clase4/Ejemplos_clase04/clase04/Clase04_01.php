<html>
	<head>
		<title>Funciones Propias en PHP</title>
	</head>
	<body>
		<?php 
		Saludar();
		echo "<br/>";
/*		
		Saludar2("Juan");
		echo "<br/>";
*/
/*		
		echo Saludar3("Rosa", "Femenino");
		echo "<br/>";
		echo Saludar3("Carlos");
		echo "<br/>";
*/		
/*		
		$valor = 1;
		echo "por valor ", Incrementar($valor);
		echo "<br/>", $valor;
		echo "<br/>por referencia ", Incrementar(&$valor);
		echo "<br/>", $valor;
*/		
		
		function Saludar()
		{
			echo "Hola Mundo, desde una funci&oacute;n!!!";
		}
/*		
		function Saludar2($nombre)
		{
			echo "Hola ", $nombre;
		}
*/
/*		
		function Saludar3($nombre, $genero = "Masculino")
		{
			$retorno = "Hola $nombre. Tu g&eacute;nero es $genero";
			return $retorno;
		}
*/
/*
		function Incrementar($a)
		{
			return $a++;
		}
*/		
		?>		
	</body>
</html>