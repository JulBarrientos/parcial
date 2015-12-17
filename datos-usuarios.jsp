<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<div class="info-maquina"  style="margin-top: 20px; height: 220px">
<input type="hidden" id="hcdusuario" value="${usu.cd_usuario}">	
	   <div class="campo-chico">
	   		<div class="label-chico">Usuario:</div>  
	   		<div class="input-chico"><input style="margin-left: 7px;"  class="input" id="id_usuario" type="text" value="${usu.id_usuario}" ></div>
	   </div>
	   <div class="campo-chico">
	   		<div class="label-chico">Apellido:</div>
	   		<div class="input-chico"><input style="margin-left: 7px;" class="input" id="ape" type="text" value="${usu.ape}" ></div>
	   </div>
	   <div class="campo-chico">
	   		<div class="label-chico">Nombre:</div>
	   		<div class="input-chico"><input style="margin-left: 7px;"  class="input" id="nom" type="text" value="${usu.nom}" ></div>
	   </div>
  
	   <div class="campo-chico" style="width: 500px; padding-top: 0px;">
	   		<div class="label-chico">Habilitado</div> 
	   		<div class="input-chico"><input  id="habilitado" type="checkbox"  <c:if test="${usu.habilitado}">checked="checked"</c:if>></div>	   		
	   </div> 
	  	<div class="botonera" >
	   		<INPUT class="inputboton" TYPE="button" VALUE="Nuevo" onclick="NuevoUsaurio()">	   
	   		<INPUT class="inputboton" TYPE="button" VALUE="Cancelar" onclick="CancelarUsuario()">
	   		<INPUT class="inputboton" TYPE="button" VALUE="Grabar" onclick="GrabarUsuario()">	  
	   		<c:if test="${usu.cd_usuario>0}">
	   			<INPUT class="inputboton"  TYPE="button" VALUE="Blanquear Contraseña" onclick="BlanquearPass(${usu.cd_usuario})">
	   		</c:if>	 		
	   	</div>	   
</div>		