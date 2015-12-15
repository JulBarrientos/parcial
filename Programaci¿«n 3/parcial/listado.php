<?php 
		include ("clasePersona.php");
		$array = Persona::ToArray();
		echo "<table border='2px'>";
		echo "<tr>";
			echo "<td>";
			echo "Nombre";
			echo "</td>";

			echo "<td>";
			echo "Apellido";
			echo "</td>";

			echo "<td>";
			echo "Legajo";
			echo "</td>";

			echo "<td>";
			echo "Foto";
			echo "</td>";
		echo "</tr>";

		for($i = 0;count($array)>$i ;$i++)
		{
			$persona = explode(", ",$array[$i]);
			echo "<tr>";
				echo "<td>";
				echo $persona[0];
				echo "</td>";

				echo "<td>";
				echo  $persona[1];
				echo "</td>";

				echo "<td>";
				echo  $persona[2];
				echo "</td>";

				echo "<td>";
				echo "<img src='imagenes/".$persona[3]."' style='width:100px;height:80px' >";
				echo "</td>";
			echo "</tr>";
		
		}
		echo "</table>";
		echo "<a href='ingreso.html'> Volver </a>"
		
?>