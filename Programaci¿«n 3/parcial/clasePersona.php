<?php 

class Persona{
		private $_nombre;
		private $_apellido;
		private $_legajo;
		private $_foto;

		public function GetNombre()
		{
			return $this->_nombre;
		}
		public function  GetApellido()
		{
			return $this->_apellido;
		}
		public function  GetLegajo()
		{
			return $this->_legajo;
		}
		public function GetFoto()
		{
			return $this->_foto;
		}

		public function __construct($nombre,$apellido,$legajo,$foto)
		{
			$this->_nombre = $nombre;
			$this->_apellido = $apellido;
			$this->_legajo = $legajo;
			$this->_foto = $foto;
		}
		public function ToString()
		{
			return $this->_nombre . ", ". $this->_apellido . ", ". $this->_legajo.", ".$this->_foto;
		}
		public static function Guardar($persona)
		{
			$file =fopen("personas.txt", "a");
			$error = fwrite($file, $persona->ToString()."\r\n");
			fclose($file);
			if($error!=false)
				return true;
			else 
				return $error;

		}
		public static function ToArray()
		{
				return file("personas.txt");
		}
}

?>