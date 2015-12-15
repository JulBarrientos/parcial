function BorrarCD(idParametro)
{
	
}

function EditarCD(idParametro)
{
	$.post("nexo.php","queHacer=DialogModificarCD",function(data){	
		$("#dialogo").html(data);
		$("#cantante").val($("#cantante"+idParametro).html());
		$("#titulo").val($("#titulo"+idParametro).html());
		$("#anio").val($("#anio"+idParametro).html());
		$("#idCD").val(idParametro);
		$(".container").removeClass("container");
		$("#dialogo").dialog({ 
			buttons: [
				{
					text: "Guardar",
					click: function() {
					$( this ).dialog( "close" );
					}
				}
			],
			resizable: false,
			width: 375
			});
	});
	
}

function GuardarCD()
{
	$.post("nexo.php","queHacer=GuardarCD&"+$("#formCd").serialize(),function(data){
	console.log(data);
	});
}