<?php
 include ("clasePersona.php");

if (isset($_POST["Alta"])){
 	$size =$_FILES['txtFoto']['size'];
 	$type = $_FILES['txtFoto']['type'];
	
	if(($type== "image/jpeg" || $type== "image/jpg" || $type== "image/png") && $size<500000)
	{
	$nombre_tmp = $_FILES["txtFoto"]["tmp_name"];
    $foto = $_FILES["txtFoto"]["name"];
    $path = "imagenes/".$foto;
    move_uploaded_file($nombre_tmp,  $path);
	$nombre = $_POST["txtNombre"];
	$apellido = $_POST["txtApellido"];
	$legajo = $_POST["txtLegajo"];
	
	$persona = new Persona($nombre,$apellido,$legajo, $foto);

	if(Persona::Guardar($persona))
		{
			echo "<h3 style='color:green;'>Carga Exitosa </h3>";
			echo "<a style='padding:5px' href='ingreso.html' > Volver </a>";
			echo "<a style='padding:5px' href='listado.php' > Mostrar Listado </a>";
		}
	else 
		echo "error";
	}
	else
		echo "Error";
}elseif (isset($_POST["Baja"])){
	$legajo = $_POST["txtLegajo"];
  	$array = Persona::ToArray();
  	$flag = false;
  	for ($i=0; $i < count($array); $i++) { 
  		$split = explode(", ", $array[$i]);
  		if($split[2]==$legajo){
  			unset($array[$i]);
  			$flag = true;
  		}
  	}
  	if($flag && file_put_contents("personas.txt",$array)!=false)
  	{
  		echo "Persona eliminada correctamente";
  	}
  	else
  		echo "Error al eliminar Persona";

  	
 }
	


	//else

?>