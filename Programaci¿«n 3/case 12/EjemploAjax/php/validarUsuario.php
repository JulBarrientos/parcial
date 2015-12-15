<?php 
session_start();
$usuario=$_POST['usuario'];
$clave=$_POST['clave'];
$recordar=$_POST['recordarme'];

$retorno;


if($usuario=="octavio@admin.com.ar" && $clave=="1234")
{			
	if($recordar=="true")
	{
		setcookie("registro",$usuario,  time()+36000 , '/');
		
	}else
	{
		setcookie("registro",$usuario,  time()-36000 , '/');
		
	}
	$_SESSION['registrado']="octavio";
	$retorno=" ingreso";

	
}else
{
	$retorno= "No-esta";
}

echo $retorno;
?>