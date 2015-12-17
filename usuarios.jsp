<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<div class="bloque" >	
<h3>Lista de Usuarios:</h3>
<input type="hidden" id="ntrselect" value="0">
	${tabla_usuarios}
	<div id="xerror" class="error" style="margin-top: 20px; height: 20px;"></div>	
	<div id="datosUsuarios">
		<jsp:include page="datos-usuarios.jsp"></jsp:include>
	</div>	
	<div class="cont-botones">

	   	<div  style="margin-top: 8px;float: left; display: none " id="spinner"><img alt="" src="images/cargando.gif"> </div>
	</div>
	
</div>

