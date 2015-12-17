<%@ page language="java"  contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript">
function redirectReport(){
	var tipo = $('input[name=radiofr]:checked', '#FormVS').val();
	var cc =  $('#selectcc').val();
	console.log(cc);
	var win = window.open("redirect.jsp","","height=600,width=900,resizable=yes,scrollbars=yes");
 	win.title="Reporte Vehículo Service";
	win.document.write('<form id="frmparam" action="pepe" method="post" name="frmparam" ></form>');

	var url="Reportes?numr=1&ReportName=rpt_CCxInventario.rptdesign&tipo="+tipo+"&cc="+cc;
	var frm =win.document.getElementById("frmparam");
	frm.action = url;
	//wwin.document.forms[0].submit();
	frm.submit();
}
</script>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<form id="FormVS" action="" method="post" name="FormVS">
<div class="bloque">
<h3>Inventarios por Centro de Costo</h3>
	<div class="info-maquina" style="margin-top:10px"> 
			<div class="campo-chico">
					<span class="label">Centro de Costo: </span>
					<select id="selectcc" >${selectcc}</select>
			</div>
			<div class="campo-mediano">
				<div class="seccion">
	       			<span class="label">Formato Excel</span>
	        		<input name="radiofr" type="radio" id="rfre" value="Excel" checked="checked" />
	         	</div >
	         	<div class="seccion">
	         		<span class="label">Formato PDF</span>
	         		<input name="radiofr" type="radio" id="rfrp" value="PDF"/>
	         	</div>
				<div class="seccion">
	               <span class="label">Formato DOC</span>
	               <input name="radiofr" type="radio" id="rfrd" value="doc"/>
	            </div>
	      </div>
	      <div class="campo-chico">	
					<input class="inputboton" type="button" value="Generar reporte" onclick="redirectReport()">	
					<div align="center"  id="spinner"></div>
			</div>
	</div>
</div>
</form>
