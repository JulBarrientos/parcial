<%@page import="inventario.tablas"  contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>

<html lang="es">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<META HTTP-EQUIV="Expires" CONTENT="-1">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Programas</title>
	<script src="scripts/jquery-1.9.1.js"  type="text/javascript"></script>
	<script src="scripts/jquery-ui-1.10.3.custom.js"  type="text/javascript"></script>
	<script src="TableFilter/tablefilter_all.js" type="text/javascript"></script>
	<script src="TableFilter/TF_Modules/tf_publicMethods.js" type="text/javascript"></script>
	<script type="text/javascript" src="scripts/mgu.js"> </script>
	<link href="css/inventario.css" rel="stylesheet" type="text/css">
</head>
 
<body class="programs" onload="llamarAplet();">

<div class="bloque" >
<div id="tableapps">

</div>
</div>

<script type="text/javascript">
function llamarAplet(){	
	var bat = window.opener.document.getElementById("applet").ProgramListTabla();
	var array = new Array();
	for (var i = 0; i < bat.length; i++) {
		array[i] = bat[i];
	}
	document.getElementById("tableapps").innerHTML = array.join("");
	setfilter('idtableapps');
	 window.opener.document.getElementById('spinner').style.display='none';
}
$(window).resize(function() {
	$("#idtableapps tbody tr").each(function(iix){
		if(iix==1){
			$(this).find("td").each(function(j){
				var thx = $(".fltrow td")[j];
				console.log($(thx));
				console.log($(this)[0].clientWidth);
				$(thx).css("width",$(this)[0].clientWidth+"px");//('style','width:'+$(this)[0].clientWidth);
				
			});
			
		}
		
		
	});
});
</script>

</body>
</html>