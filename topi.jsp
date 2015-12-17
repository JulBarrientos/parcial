<%@ page language="java"  contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>SGH - Sistema de Gestión de Horas</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="Content-language" content="es" />   
	<link href="css/websgh.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="tkt/thickbox.css" type="text/css" media="screen" />
<script type="text/javascript" language=javascript>
var childwindows = new Array();
window.onunload = function closeChildWin(){
	 for(var i=0; i<childwindows.length; i++){
	  try{
	     childwindows[i].close();
	  }catch(e){
	   alert(e);
	  }
	 }
	}
</script>

    <script type="text/javascript" src ="scripts/ajax-utils.js"> </script> 
    <script type="text/javascript" src ="scripts/websgh.js"> </script> 
    <script type="text/javascript" src="tkt/jquery.js"></script>
    <script type="text/javascript" src="tkt/thickbox.js"></script>
<style type="text/css">
<!--
textarea { resize:none; }
-->
</style>

	<script type="text/javascript">
		function mostrarReportes(sVisible){		
//		(websghObj) session.getAttribute("SghObj")).setnMenu(2);
		}
		function mostrarClientes(sVisible){		
//		(websghObj) session.getAttribute("SghObj")).setnMenu(1);
		}		
		function cambio(){		
		
		alert (document.getElementById('mnuI').value);
		
		}		
var isIE = navigator.userAgent.indexOf("MSIE") > 1;
var isChrome = navigator.userAgent.indexOf("Chrome") > 1;
var isFirefox = navigator.userAgent.indexOf("Firefox") > 1;
if(isIE || isChrome) {
document.onkeydown = function () {
var e = event || window.event;
var keyASCII = parseInt(e.keyCode, 10);
var src = e.srcElement;
return checkTecla(keyASCII, src);
}
}
if(isFirefox) {
document.onkeypress = function(ev){
	var e = ev || window.event;
	var keyASCII = parseInt(e.keyCode, 10); 
	var src = e.target; 
	return checkTecla(keyASCII, src);
	}
}
function checkTecla(keyASCII, src){
var tag = src.tagName.toUpperCase();
switch (keyASCII){
	case 8 : /*backspace key*/
		if(src.readOnly || src.disabled || (tag != "INPUT" && tag != "TEXTAREA")) {
		return false; 
	}
	if(src.type) {
		var type = ("" + src.type).toUpperCase();
		return type != "CHECKBOX" && type != "RADIO" && type != "BUTTON"; 
	}
	break;
	default: 
	return true; 
} 
}	</script>
</head>
	

