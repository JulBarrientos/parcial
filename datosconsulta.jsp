<!DOCTYPE html>
<%@page import="inventario.Inventario,inventario.Inventario_his,inventario.utils;"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
	<object type="application/x-java-applet" id="applet"  width="0" height="0">
 		<param name="archive" value="Inventario.jar" />
 		<param name="code" value="inventario.HardInf.class" />
  		Applet failed to run.  No Java plug-in was found.
 	</object>
 
<form action=""  method="post" id="frm_consulta" name="frm_consulta">
<input type="hidden" id="hizosubmit" value="0">
	<div id="datosConsul" style="border:none; margin-top: 20px;" >
	<table><thead>
	<tr>
		<td class="subtitulo" style="border-right: 1px solid #006699 !important;font-size: 13px;">Actual</td>
		<td class="subtitulo"><span style="  margin-left: 25px;
  font-size: 13px;">Historial</span> 
			<div style="float: right;" ><div style="float:left;" id="hora_log"><%=(request.getAttribute("inventarioh")!=null? utils.getDateString(((Inventario_his)request.getAttribute("inventarioh")).getFecha_log(), 0):"<span style='color:red'>No Tiene</span>")  %></div>
				<div style="float: right; margin-left: 21px;margin-top: -5px;">
					<input type='hidden' id="nelemento" value="${nelementolista}">
					<input type="hidden" id="ListInventarioHistsize" value="${ListInventarioHistsize}">
					<c:if test="${inventarioh !=null}">
						<div title='Anterior' class="aant" id="aant" onclick="VerAnterior();"></div>
						<div title='Siguiente' class="asig" id="asig" onclick="VerSiguiente();"></div>
					</c:if>
				</div>
			</div>
		</td>
	</tr>
	</thead>
	<tbody>
	<tr>
	<td style="border-right: 1px solid #006699 !important" ><table style="width: 100%; margin-left: 5px; font-weight: bold;float:left">
			<tr style="height: 30px;">
				<td class="tdbindeos" style="border: none;"><label class="xlabel">Hostname:</label></td>
				<td class="tdbindeos"><input class="input"  style="width:250px"  id="hostname" name="hostname" value="${inventario.hostname}" ></td>
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">Usuario</label></td>
		   		<td class="tdbindeos"><input class="input" style="width:130px" id="user" name="user" value="${inventario.usuario}"></td>										   		
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Procesador:</label></td>
				<td class="tdbindeos" ><input class="input" id="procesador" style="width:250px" name="procesador" value="${inventario.procesador}"></td>
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">RAM:</label></td>
				<td class="tdbindeos" colspan="3"><input class="input" style="width:250px" id="ram" name="ram" value="${inventario.ram}" ></td>
																				 	
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">Discos:</label></td>
				<td class="tdbindeos"><input class="input" style="width:250px" id="disco" name="disco" value="${inventario.discos}" ></td>
			</tr>
			<tr>	
				<td class="tdbindeos"><label class="xlabel">Sistema Operativo:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="os" name="os" value="${inventario.SO}"></td>				
			</tr>
			
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Lic. del S.O:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="licso" name="licso" value="${inventario.licso}" ></td> 				
			</tr>
			<tr>    
			    <td class="tdbindeos" ><label class="xlabel">Serie del S.O:</label></td>  
				<td class="tdbindeos" colspan="3"><input class="input" style="width:250px" id="serieso" name="serieso" value="${inventario.serieso}"  ></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel">Lic. de Office:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="office" name="office" value="${inventario.licoffice}"  ></td>				
			</tr>
			<tr>	
				<td class="tdbindeos" ><label class="xlabel">Serie del Equipo:</label></td>
				<td class="tdbindeos" colspan="3"><input class="input" style="width:250px" id="serie" name="serie" value="${inventario.seriesist}" readonly="readonly" ></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel" style="vertical-align: middle;">Estado:</label></td>
				<td class="tdbindeos"><select id="estado" name="estado" onchange="limpiar()"><option value="Asignado" ${inventario.estado=="Asignado"?'selected="selected"':'' }>Asignado</option><option value="En Stock" ${inventario.estado=="En Stock"?'selected="selected"':'' }>En Stock</option></select></td>		
			</tr>
			<tr>	
				<td class="tdbindeos" ><label class="xlabel">CC:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:56px" id="cc" name="cc" value="${inventario.cc}" maxlength="4" onkeypress="return CheckKeys(1,event)"></td>							
			</tr>			

			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Apellido:</label></td>
				<td class="tdbindeos" ><input class="input" maxlength="50" style="width:250px" id="ape" name="ape" value="${inventario.ape}" ></td>				
			</tr>
			<tr>	
				<td class="tdbindeos" ><label class="xlabel">Nombre:</label></td>
				<td class="tdbindeos" colspan="3"><input  class="input" maxlength="50" style="width:250px" id="nom" name="nom" value="${inventario.nom}"></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel" style="vertical-align: middle;">Observaciones:</label></td>
				<td class="tdbindeos"><textarea style="vertical-align: middle;" id="obsv" name="obsv" >${inventario.observaciones}</textarea></td>	
			</tr>
			<tr>	
				<td class="tdbindeos" colspan="4">
					<table>	
						<tr style="height: 30px;">
							<td class="tdbindeos" colspan="4"><label class="xlabel" style="vertical-align: middle;">Requerimiento aprobado por el responsable del CC actual:</label>
								<input style="vertical-align: middle; margin-left: 13px;" class="input" type="checkbox" id="ccact" name="ccact"  ${(inventario.aprobocca) ? 'checked' : ''}></td>			
						</tr>
						<tr>		
							<td class="tdbindeos"  colspan="4" ><label class="xlabel" style="vertical-align: middle; ">Requerimiento por el responsable del CC futuro:</label> 
								<input style="vertical-align: middle; margin-left: 71px;" class="input" type="checkbox" id="ccfutu" name="ccfutu"${(inventario.aproboccf) ? 'checked' : ''}> </td>
						</tr>	
						<tr>	
							<td class="tdbindeos" ><label class="xlabel">Requerimiento:</label></td>
							<td class="tdbindeos"colspan="3" ><input class="input" style="width:250px" id="requerimiento" name="requerimiento" value="${inventario.requerimiento}" onkeypress="return CheckKeys(5,event)"></td>
						</tr>
					</table>
				</td>			
			</tr>		  
			<tr>
				<td style="padding-left: 0px; height: 15px;border: none;" colspan="4"><div class="error" id="diverror"></div></td>
			</tr>
			<tr>
				<td colspan="2"style="padding-left: 0px;">
					<div class="botonera" >
					   	<INPUT class="inputboton" TYPE="button" VALUE="Recuperar" onclick="verSpin(3,'inventario')">
						<INPUT class="inputboton" id="recuperarapps" TYPE="button"  VALUE="Recuperar Apps" onclick="verSpin(3,'apps')">
						<c:if test="${appshist!=null}">
						<INPUT class="inputboton" id="recuperarapps" TYPE="button"  VALUE="Ver Apps Hist" onclick="verSpin(3,'appshis')">
						</c:if>
						<button type="button" class="inputboton" onclick="BajaConsulta()">Eliminar</button>
						<button type="button" class="inputboton" onclick="validarformconsulta()">Guardar</button>						
					</div>
					<div  style="display:none ;margin-top: 10px; " id="spinner"><img alt="" src="images/cargando.gif"> </div>
				</td>
			</tr>
		</table>
	</td>
	<td id="td_include_hist" style="width: 49%">
		<jsp:include page="datosconsultahist.jsp"></jsp:include>
	</td>
	</tr>
	</tbody>
	</table>			
	</div>
	<input type="hidden" id="idconsulta" name="idconsulta" value="${inventario.id_maquina}">
	<input type="hidden" id="seriesist" name="seriesist" value="${inventario.seriesist}">
	<input type="hidden" id="qbtnapreto" value="${qbtnapreto} ">
</form>