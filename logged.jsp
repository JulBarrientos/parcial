<%@ page import="java.io.*,java.lang.System, inventario.invObj"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", -1);
	invObj invobj = (invObj) request.getSession().getAttribute("invobj");
	if (invobj ==null || !invobj.isLogged()){
		RequestDispatcher dispatcher =
				getServletContext().getRequestDispatcher("/login.jsp");
				dispatcher.forward(request, response);
	}
%>
<!DOCTYPE html>
<html>

<head>

<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Expires" CONTENT="-1">
<META http-equiv="X-UA-Compatible" content="IE=edge">
<META http-equiv="X-UA-Compatible" content="IE=9" />
<META name="viewport" content="width=device-width, initial-scale=1">
<META name="description" content="">
<META name="author" content="">

<title>Inventario- Securitas</title>

<link href="css/inventario.css" rel="stylesheet" type="text/css">

<script src="scripts/jquery-1.9.1.js"  type="text/javascript"></script>
<script src="scripts/jquery-ui-1.10.3.custom.js"  type="text/javascript"></script>
<script src="TableFilter/tablefilter_all.js" type="text/javascript"></script>
<script src="TableFilter/TF_Modules/tf_publicMethods.js" type="text/javascript"></script>
<script type="text/javascript" src="scripts/mgu.js"> </script>
<script src="https://spiceworks.github.io/spiceworks-js-sdk/dist/spiceworks-sdk.js" type="text/javascript"></script>
<script src="https://code.jquery.com/jquery-2.1.3.min.js" type="text/javascript"></script>
<script type="text/javascript">
   $(document).ready(function(){
     var card = new SW.Card();
     var inventory = card.services('inventory');
     inventory.request('devices').then(function(data){
       $.each(data.devices, function(index, device){
         $('body').append('<p>' + device.name);
       });
     });
   });
</script>
<script type="text/javascript">



var isIE = navigator.userAgent.indexOf("MSIE") > 1;
var isChrome = navigator.userAgent.indexOf("Chrome") > 1;
var isFirefox = navigator.userAgent.indexOf("Firefox") > 1;
if(isIE || isChrome) {
document.onkeydown = function () {
var e = event || window.event;
var keyASCII = parseInt(e.keyCode, 10);
var src = e.srcElement;
return checkTecla(keyASCII, src);
};
}
if(isFirefox) {
document.onkeypress = function(ev){
	var e = ev || window.event;
	var keyASCII = parseInt(e.keyCode, 10); 
	var src = e.target; 
	return checkTecla(keyASCII, src);
	};
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
} 


function submenu(item) {
	document.getElementById("submenu-"+item).style.visibility="visible";
}
</script>
</head>

<body>
	<div id="main">
	<!-- 	<div class="main-top"></div> -->
			
				<div class="top-content">
				<div class="sub-content">
					<div class="Texto_Blanco"
						style=" margin-right: 40px; margin-top: 20px; text-align: right">
								<a href="Login?accion=logoff" class="Texto_Rojo">Logoff</a>
					</div>
					<div class="logo">
						<img src="images/securitas-logo.png" alt="sgh-web-logo"  />
						</div>
					<div class="Texto_Blanco"
						style="margin-left:200px; text-align: left; font-size: 11pt; float: left" title="${dbserver} - 04/02/2015">Inventario Web</div>
					<div class="Texto_Blanco"
						style=" margin-right: 40px; margin-top: 35px; margin-bottom: 37px; text-align: right; float: right">
						<c:if test="${invobj.logged}">
							<strong> Usuario: ${invobj.usuario.dsUsuario}
								 </strong>
						</c:if>
					</div>
			</div>
		</div>
			<div class="content">
					<div class="m">
						<div id="divmenu" class="top-menu" style="visibility: visible;">
							<ul name="menu" id="mnu">								
								<c:if test="${invobj.logged}">
									<li id="M_1" onclick="gotofuncion(1,'carga');"><a
										 href="#" id="A_1"
										title="Alta">Alta</a></li>
								</c:if>
								<c:if test="${invobj.logged}">
									<li id="M_2" onclick="gotofuncion(2,'consulta');"><a
										 href="#" id="A_2"
										title="Consulta">Consulta</a></li>
								</c:if>
								<c:if test="${invobj.logged}">
									<li id="M_4" onclick="gotofuncion(4,'consultahist');"><a
										 href="#" id="A_4"
										title="Consulta Historica">Consulta Histórica</a></li>
								</c:if>									
								<c:if test="${invobj.logged}">
									<li id="M_3" onclick="gotofuncion(3,'usuarios');"><a
										 href="#" id="A_3"
										title="Usuarios">Usuarios</a></li>
								</c:if>
								<c:if test="${invobj.logged}">
									<li id="M_5" onclick="submenu('reportes');"><a
										 href="#" id="A_5"
										title="Usuarios">Reportes</a></li>
								</c:if>	
							</ul>
						</div>
						 <div id="submenu-reportes" class="submenu-top-cat" style="top:130px;visibility:hidden;margin-left: 333px;">
							<ul>
								<li onclick="gotofuncion(5,'reportes',0,'CCxInventario');"><a>Inventarios por CC</a></li>
								
							</ul>
						</div> 
					</div>
				<div id="info" class="cuerpo">
					<c:if test="${param.pagina!=null }">
						<c:import url="${param.pagina}.jsp"></c:import>
					</c:if>
					
				</div>
			</div>
		
	</div>
	
</body>
</html>
