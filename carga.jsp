<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<div class="bloque" >	
	<object type="application/x-java-applet" id="applet"  width="0" height="0">
 		<param name="archive" value="Inventario.jar" />
 		<param name="code" value="inventario.HardInf.class" />
  		Applet failed to run.  No Java plug-in was found.
 	</object>
 	<h3>Alta de datos de equipo:</h3>
	<div class="info-maquina" style="margin-top: 10px;">	
	   <div class="campo">
	   		<div class="label">HostName:</div>  
	   		<div class="input-normal"><input  type="text" id="hostname" readonly="readonly" ></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Usuario:</div>
	   		<div class="input-normal"><input style="width:130px" type="text" id="user" readonly="readonly" ></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Procesador:</div>
	   		<div class="input-normal"><input type="text" id="procesador" readonly="readonly"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Memoria Ram:</div>
	   		<div class="input-normal"><input type="text" id="ram" readonly="readonly"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Discos:</div>  
	   		<div class="input-normal"><input type="text" id="disco" readonly="readonly"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Sistema Operativo:</div>
	   		<div class="input-normal"><input type="text" id="os" readonly="readonly" ></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Licencia del S.O:</div>
	   		<div class="input-normal"><input type="text" id="licso" readonly="readonly"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Serie del S.O:</div>
	   		<div class="input-normal"><input type="text" id="serieso" readonly="readonly"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Licencia de Office:</div>
	   		<div class="input-normal"><input type="text" id="office" readonly="readonly" ></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Serie del Equipo:</div>
	   		<div class="input-normal"><input type="text"  id="serie" readonly="readonly" maxlength="50" onkeypress="return CheckKeys(5,event)"></div>
	   </div>	   
	   <div class="campo">
	   		<div class="label">Estado</div> 
	   		<div class="input-normal"><select id="estado" name="estado" onchange="limpiar()"><option value="Asignado" ${inventario.estado=="Asignado"?'selected="selected"':'' }>Asignado</option><option value="En Stock" ${inventario.estado=="En Stock"?'selected="selected"':'' }>En Stock</option></select></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Centro de Costo:</div>
	   		<div class="input-normal"><input type="text" id="cc" style="width: 80px" maxlength="4" onkeypress="return CheckKeys(1,event)" ></div>
	   </div>
	   <div class="campo">	   
	   		<div class="label">Apellido:</div>
	   		<div class="input-normal"><input type="text" id="ape" maxlength="50"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Nombre:</div>
	   		<div class="input-normal"><input type="text" id="nom" maxlength="50"></div>
	   </div>
	   <div class="campo">
	   		<div class="label">Observaciones</div> 
	   		<div class="input-normal"><textarea   id="obsv" ></textarea></div>
	   </div>
	   <div class="campo">
	   		<div class="label">N° Requerimiento:</div>
	   		<div class="input-normal"><input type="text" id="requerimiento" onkeypress="return CheckKeys(5,event)"></div>
	   </div>
	   <div class="campo" style="display: none;">
	   		<input type="checkbox" id="programas" name="programas">
	   </div>
	   <div class="cont-botones">	   
	   	<INPUT class="inputboton" TYPE="button" VALUE="Recuperar" onclick="verSpin(3, 'inventario')">
	   	<INPUT class="inputboton" id="recuperarapps" TYPE="button"  disabled="disabled"  VALUE="Recuperar Apps" onclick="verSpin(3, 'apps')">
	   	<INPUT class="inputboton" TYPE="button" VALUE="Guardar" onclick="cargar()">
	   	<div  style=" display:none;margin-top: 10px; " id="spinner"><img alt="" src="images/cargando.gif"> </div>
	   	<div class="error" style="margin-top: 30px;" id="diverror"></div>
	   </div>
	</div>
</div>

