<?php
class Fabrica{

	private $_razonSocial;
	private  $_empleados;

	function __construct($razonSocial)
	{
		$this->_razonSocial = $razonSocial;
		$this->_empleados = array();
	}

	function AgregarPersona($perr)
	{
		array_push($this->_empleados,  $perr);
	}
	function CalcularSalario()
	{
		//devuelve salario
	}

	function SacarPersona($per)
	{
			if (($key = array_search($per, $this->_empleados)) !== false)
   					 unset($this->_empleados[$key]);
	}
	private function EvitarDuplicados()
	{
		$this->_empleados = array_unique($this->_empleados);
	}
	function ToString()
	{
		$empleados = "";
		foreach ($this->_empleados as $item ) {
					$empleados .= "<p>" .$item->ToString()."</p>";
				}		
		return "Razon Social: ".$this->_razonSocial . "<br><br>". "Empleados: " .$empleados;
	}
}
?>