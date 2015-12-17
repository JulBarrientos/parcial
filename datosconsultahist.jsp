<%@page import="inventario.Inventario,inventario.Inventario_his,inventario.utils;"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:if test="${inventarioh!=null}">
<input type="hidden" id="hora_logx" value = '<%= utils.getDateString(((Inventario_his)request.getAttribute("inventarioh")).getFecha_log(), 0)  %>' >
<table class="${classtable}" style="width: 100%; font-weight: bold;margin-top:-79px; padding: 30px">
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel">Hostname:</label></td>
				<td class="tdbindeos"><input class="input"  readonly="readonly"  style="width:250px"  id="hostnameh" name="hostnameh" value="${inventarioh.hostname}" ></td>
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">Usuario</label></td>
		   		<td class="tdbindeos"><input class="input"  readonly="readonly" style="width:130px" id="userh" name="userh" value="${inventarioh.usuario}"></td>										   		
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Procesador:</label></td>
				<td class="tdbindeos" ><input class="input"  readonly="readonly" id="procesadorh" style="width:250px" name="procesadorh" value="${inventarioh.procesador}"></td>
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">RAM:</label></td>
				<td class="tdbindeos" colspan="3"><input class="input"  readonly="readonly" style="width:250px" id="ramh" name="ramh" value="${inventarioh.ram}" ></td>
																				 	
			</tr>
			<tr>
				<td class="tdbindeos"><label class="xlabel">Discos:</label></td>
				<td class="tdbindeos"><input class="input"  readonly="readonly" style="width:250px" id="discoh" name="discoh" value="${inventarioh.discos}" ></td>
			</tr>
			<tr>	
				<td class="tdbindeos"><label class="xlabel">Sistema Operativo:</label></td>
				<td class="tdbindeos" ><input class="input"  readonly="readonly" style="width:250px" id="osh" name="osh" value="${inventarioh.SO}"></td>				
			</tr>
			
			
			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Lic. del S.O:</label></td>
				<td class="tdbindeos" ><input class="input"  readonly="readonly" style="width:250px" id="licsoh" name="licsoh" value="${inventarioh.licso}" ></td> 				
			</tr>
			<tr>    
			    <td class="tdbindeos" ><label class="xlabel">Serie del S.O:</label></td>  
				<td class="tdbindeos" colspan="3"><input class="input"  readonly="readonly" style="width:250px" id="seriesoh" name="seriesoh" value="${inventarioh.serieso}"  ></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel">Lic. de Office:</label></td>
				<td class="tdbindeos" ><input class="input"  readonly="readonly" style="width:250px" id="officeh" name="officeh" value="${inventarioh.licoffice}"  ></td>				
			</tr>
			<tr>	
				<td class="tdbindeos" ><label class="xlabel">Serie del Equipo:</label></td>
				<td class="tdbindeos" colspan="3"><input class="input"  readonly="readonly" style="width:250px" id="serieh" name="serieh" value="${inventarioh.seriesist}" readonly="readonly" ></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel" style="vertical-align: middle;">Estado:</label></td>
				<td class="tdbindeos"><select id="estadoh" disabled="disabled" name="estadoh" onchange="limpiar()"><option value="Asignado" ${inventarioh.estado=="Asignado"?'selected="selected"':'' }>Asignado</option><option value="En Stock" ${inventarioh.estado=="En Stock"?'selected="selected"':'' }>En Stock</option></select></td>		
			</tr>
			<tr>	
				<td class="tdbindeos" ><label class="xlabel">CC:</label></td>
				<td class="tdbindeos" ><input class="input"  readonly="readonly" style="width:56px" id="cch" name="cch" value="${inventarioh.cc}" maxlength="4" onkeypress="return CheckKeys(1,event)"></td>							
			</tr>			

			<tr style="height: 30px;">
				<td class="tdbindeos"><label class="xlabel">Apellido:</label></td>
				<td class="tdbindeos" ><input class="input"  readonly="readonly" maxlength="50" style="width:250px" id="apeh" name="apeh" value="${inventarioh.ape}" ></td>				
			</tr>
			<tr>	
				<td class="tdbindeos" ><label class="xlabel">Nombre:</label></td>
				<td class="tdbindeos" colspan="3"><input  class="input"  readonly="readonly" maxlength="50" style="width:250px" id="nomh" name="nomh" value="${inventarioh.nom}"></td>
			</tr>
			
			<tr style="height: 30px;">
				<td class="tdbindeos" ><label class="xlabel" style="vertical-align: middle;">Observaciones:</label></td>
				<td class="tdbindeos"><textarea readonly="readonly" style="vertical-align: middle;" id="obsvh" name="obsvh" >${inventarioh.observaciones}</textarea></td>	
			</tr>
			<tr>	
				<td class="tdbindeos" colspan="4">
					<table>	
						<tr style="height: 30px;">
							<td class="tdbindeos" colspan="4"><label class="xlabel" style="vertical-align: middle;">Requerimiento aprobado por el responsable del CC actual:</label>
								<input style="vertical-align: middle; margin-left: 13px;" class="input"  disabled="disabled" type="checkbox" id="ccacth" name="ccacth"  ${(inventarioh.aprobocca) ? 'checked' : ''}></td>			
						</tr>
						<tr>		
							<td class="tdbindeos"  colspan="4" ><label class="xlabel" style="vertical-align: middle; ">Requerimiento por el responsable del CC futuro:</label> 
								<input style="vertical-align: middle; margin-left: 71px;" class="input" disabled="disabled" type="checkbox" id="ccfutuh" name="ccfutuh"${(inventarioh.aproboccf) ? 'checked' : ''}> </td>
						</tr>	
						<tr>	
							<td class="tdbindeos" ><label class="xlabel">Requerimiento:</label></td>
							<td class="tdbindeos"colspan="3" ><input class="input"  readonly="readonly" style="width:250px" id="requerimientoh" name="requerimientoh" value="${inventarioh.requerimiento}" onkeypress="return CheckKeys(5,event)"></td>
						</tr>
					</table>
				</td>			
			</tr>
			<tr></tr>
				
		</table>
</c:if>


