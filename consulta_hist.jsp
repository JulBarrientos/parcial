
<%@page import="inventario.tablas" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<div class="bloque" >	
<% 
	response.setHeader("Cache-Control","no-cache"); 
	response.setHeader("Pragma","no-cache"); 
	response.setDateHeader ("Expires", -1);  
	tablas xtabla = new tablas(); 
%>
<h3>Lista de Equipos:</h3>
<%=xtabla.tabla_historico()%>
	
<input type="hidden" id="numtrselec" name="numtrselec" value="${ntrhist}">
<input type="hidden" id="idconsuhist" name="idconsuhist" value="${idconsuhist}">
<div id="datosconsulta" class="bindeos">
<c:if test="${idconsuhist!=null && ntrhist != null}">
	<script type="text/javascript">	
	setfilter("idtablehist");
		
	</script>	
</c:if>
</div>
</div>