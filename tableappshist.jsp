<%@page import="inventario.tablas" language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<META HTTP-EQUIV="Expires" CONTENT="-1">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Programas Hist</title>
	<script src="scripts/jquery-1.9.1.js"  type="text/javascript"></script>
	<script src="scripts/jquery-ui-1.10.3.custom.js"  type="text/javascript"></script>
	<script src="TableFilter/tablefilter_all.js" type="text/javascript"></script>
	<script src="TableFilter/TF_Modules/tf_publicMethods.js" type="text/javascript"></script>
	<script type="text/javascript" src="scripts/mgu.js"> </script>
	<link href="css/inventario.css" rel="stylesheet" type="text/css">
</head>
<body class="programs">
<div class="bloque">
	<div>
	${tablappshist}
	</div>
</div>
<script type="text/javascript">
setfilter('idtableapps');
window.opener.document.getElementById('spinner').style.display='none';
$(window).resize(function() {
	$("#idtableapps tbody tr").each(function(iix){
		if(iix==1){
			$(this).find("td").each(function(j){
				var thx = $(".fltrow td")[j];
				console.log($(thx));
				console.log($(this)[0].clientWidth);
				$(thx).css("width",$(this)[0].clientWidth+"px");//('style','width:'+$(this)[0].clientWidth);
				
			});
			
		}
		
		
	});
});
</script>
</body>
</html>