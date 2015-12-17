<!DOCTYPE html>
<%@page import="inventario.Inventario"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form   action="Goto?datosconsulta=s"  method="post" id="frm_consulta" name="frm_consulta" >
	<div id="datosConsul" style="border:none; margin-top: 20px;" >
		<table style="width: 96%; margin-left: 5px; font-weight: bold;">
			<tr style="height: 30px;">
				<td class="tdbindeos" style="border: none;"><label class="xlabel">Hostname:</label></td>
				<td class="tdbindeos"><input class="input"  style="width:250px"  id="hostname" name="hostname" value="${inventario.hostname}" ></td>
				<td class="tdbindeos"><label class="xlabel">Usuario</label></td>
		   		<td class="tdbindeos"><input class="input" style="width:130px" id="user" name="user" value="${inventario.usuario}"></td>										   		
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Procesador:</label></td>
				<td class="tdbindeos" ><input class="input" id="procesador" style="width:250px" name="procesador" value="${inventario.procesador}"></td>
				<td class="tdbindeos"><label class="xlabel">RAM:</label></td>
				<td class="tdbindeos" colspan="3"><input class="input" style="width:250px" id="ram" name="ram" value="${inventario.ram}" ></td>
																				 	
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">Discos:</label></td>
				<td class="tdbindeos"><input class="input" style="width:250px" id="disco" name="disco" value="${inventario.discos}" ></td>
				<td class="tdbindeos"><label class="xlabel">Sistema Operativo:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="os" name="os" value="${inventario.SO}"></td>				
			</tr>
			
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Lic. del S.O:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="licos" name="licos" value="${inventario.licso}" ></td> 				
			    <td class="tdbindeos" ><label class="xlabel">Serie del S.O:</label></td>  
				<td class="tdbindeos" colspan="3"><input class="input" style="width:250px" id="serieso" name="serieso" value="${inventario.serieso}"  ></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel">Lic. de Office:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="office" name="office" value="${inventario.licoffice}"  ></td>				
				<td class="tdbindeos" ><label class="xlabel">Serie del Equipo:</label></td>
				<td class="tdbindeos" colspan="3"><input class="input" style="width:250px" id="serie" name="serie" value="${inventario.seriesist}" readonly="readonly" ></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Apellido:</label></td>
				<td class="tdbindeos" ><input class="input" maxlength="50" style="width:250px" id="ape" name="ape" value="${inventario.ape}" ></td>				
				<td class="tdbindeos" ><label class="xlabel">Nombre:</label></td>
				<td class="tdbindeos" colspan="3"><input  class="input" maxlength="50" style="width:250px" id="nom" name="nom" value="${inventario.nom}"></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel">CC:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:56px" id="cc" name="cc" value="${inventario.cc}" maxlength="4" onkeypress="return CheckKeys(1,event)"></td>							
				<td class="tdbindeos" ><label class="xlabel">Requerimiento:</label></td>
				<td class="tdbindeos"colspan="3" ><input class="input" style="width:250px" id="requerimiento" name="requerimiento" value="${inventario.requerimiento}" onkeypress="return CheckKeys(5,event)"></td>
			</tr>			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel" style="vertical-align: middle;">Observaciones:</label></td>
				<td class="tdbindeos"><textarea style="vertical-align: middle;" id="obsv" name="obsv" >${inventario.observaciones}</textarea></td>	
				<td class="tdbindeos" colspan="4">
					<table>	
						<tr style="height: 30px;">
							<td class="tdbindeos" colspan="4"><label class="xlabel" style="vertical-align: middle;">Requerimiento aprobado por el responsable del CC actual:</label>
								<input  disabled style="vertical-align: middle; margin-left: 13px;" class="input" type="checkbox" id="ccact" name="ccact"  ${(inventario.aprobocca) ? 'checked' : ''}></td>			
						</tr>
						<tr>		
							<td class="tdbindeos"  colspan="4" ><label  class="xlabel" style="vertical-align: middle; ">Requerimiento por el responsable del CC futuro:</label> 
								<input disabled style="vertical-align: middle; margin-left: 71px;" class="input" type="checkbox" id="ccfutu" name="ccfutu"${(inventario.aproboccf) ? 'checked' : ''}> </td>
						</tr>	
						<tr>	
							<td class="tdbindeos" ><label class="xlabel" style="vertical-align: middle;">Estado:</label></td>
							<td class="tdbindeos"><select id="estado" name="estado">
														<option value="En Stock" ${inventario.estado=="En Stock"?'selected="selected"':'' }>En Stock</option>
														<option value="Asignado" ${inventario.estado=="Asignado"?'selected="selected"':'' }>Asignado</option>
												  </select></td>		
						</tr>
					</table>
				</td>			
			</tr>		  
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel">Fecha alta:</label></td>
				<td class="tdbindeos" ><input class="input" style="width:250px" id="falta" name="falta" value="${inventario.fecha_alta}" maxlength="4" onkeypress="return CheckKeys(1,event)"></td>							
				<td class="tdbindeos" ><label class="xlabel">Fecha Mod.:</label></td>
				<td class="tdbindeos"colspan="3" ><input class="input" style="width:250px" id="flog" name="flog" value="${inventario.fecha_log}" onkeypress="return CheckKeys(5,event)"></td>
			</tr>			
			<tr>
				<td style="padding-left: 0px; height: 15px;border: none;" colspan="4"><div class="error" id="diverror"></div></td></tr>
		</table>
	</div>
	<input type="hidden" id="idconsulta" name="idconsulta" value="${inventario.id_maquina}">
	<input type="hidden" id="seriesist" name="seriesist" value="${inventario.seriesist}">
	<input type="hidden" id="qbtnapreto" value="${qbtnapreto} ">
</form>