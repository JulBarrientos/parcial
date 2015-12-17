
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
<%=xtabla.tabla_inventario()%>
	
<input type="hidden" id="numtrselec" name="numtrselec" value="">
<input type="hidden" id="idconsu" name="idconsu" value="${idconsu}">
<input type="hidden" id="seriesist" name="seriesist" value="${seriesist}">

<div id="datosconsulta" class="bindeos">
</div>

</div>