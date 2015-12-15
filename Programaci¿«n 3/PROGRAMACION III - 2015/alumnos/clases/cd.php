<?php
class cd
{
	public $id;
 	public $titulo;
  	public $cantante;
  	public $año;

  
	
  	public function mostrarDatos()
	{
	  	return "Metodo mostar:".$this->titulo."  ".$this->cantante."  ".$this->año;
	}

	
	 public function InsertarElCd()
	 {
				$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
				$consulta =$objetoAccesoDato->RetornarConsulta("INSERT into cds (titel,interpret,jahr)values('$this->titulo','$this->cantante','$this->año')");
				$consulta->execute();
				return $objetoAccesoDato->RetornarUltimoIdInsertado();
				

	 }
	 public function InsertarElCdParametros()
	 {
				$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
				$consulta =$objetoAccesoDato->RetornarConsulta("INSERT into cds (titel,interpret,jahr)values(:titulo,:cantante,:anio)");
				$consulta->bindValue(':titulo',$this->titulo, PDO::PARAM_INT);
				$consulta->bindValue(':anio', $this->año, PDO::PARAM_STR);
				$consulta->bindValue(':cantante', $this->cantante, PDO::PARAM_STR);
				$consulta->execute();		
				return $objetoAccesoDato->RetornarUltimoIdInsertado();
	 }
	 


  



	public static function TraerUnCdAnio($id,$anio) 
	{
			$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
			$consulta =$objetoAccesoDato->RetornarConsulta("select  titel as titulo, interpret as cantante,jahr as año from cds  WHERE id=? AND jahr=?");
			$consulta->execute(array($id, $anio));
			$cdBuscado= $consulta->fetchObject('cd');
      		return $cdBuscado;				

			
	}

	public static function TraerUnCdAnioParamNombre($id,$anio) 
	{
			$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
			$consulta =$objetoAccesoDato->RetornarConsulta("select  titel as titulo, interpret as cantante,jahr as año from cds  WHERE id=:id AND jahr=:anio");
			$consulta->bindValue(':id', $id, PDO::PARAM_INT);
			$consulta->bindValue(':anio', $anio, PDO::PARAM_STR);
			$consulta->execute();
			$cdBuscado= $consulta->fetchObject('cd');
      		return $cdBuscado;				

			
	}
	
	public static function TraerUnCdAnioParamNombreArray($id,$anio) 
	{
			$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
			$consulta =$objetoAccesoDato->RetornarConsulta("select  titel as titulo, interpret as cantante,jahr as año from cds  WHERE id=:id AND jahr=:anio");
			$consulta->execute(array(':id'=> $id,':anio'=> $anio));
			$consulta->execute();
			$cdBuscado= $consulta->fetchObject('cd');
      		return $cdBuscado;				

			
	}



}