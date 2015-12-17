<%@ page import="java.io.*,java.lang.System"
	contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!doctype html>
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", -1);
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Expires" CONTENT="-1">
<title>Inventario</title>
<script src="https://spiceworks.github.io/spiceworks-js-sdk/dist/spiceworks-sdk.js" type="text/javascript"></script>
<script src="https://code.jquery.com/jquery-2.1.3.min.js" type="text/javascript"></script>
<script type="text/javascript">
   $(document).ready(function(){
     var card = new SW.Card();
     var inventory = card.services('inventory');
     inventory.request('devices').then(function(data){
       $.each(data.devices, function(index, device){
         $('body').append('<p>' + device.name);
       });
     });
   });
</script>
<script type="text/javascript">

function redirect() {
    self.location = "Login?action=inicio";
}
 </script>
</head>

<body onload="redirect()">
</body>
</html>
