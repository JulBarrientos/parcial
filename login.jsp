<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Inventario - Securitas</title>
<link href="css/login-inventario.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="tkt/thickbox.css" type="text/css" media="screen" />
<script type="text/javascript" src="tkt/jquery.js"></script>
<script type="text/javascript" src="tkt/thickbox.js"></script>
<script type="text/javascript">
if (parent.frames.length > 0) {
    parent.location.href = self.location.href;
}


function BlurPass(object)
{

	if(document.getElementById("passlog").value==''){
		document.getElementById("passlog").style.display="none";
		document.getElementById("passtxtlog").style.display="block";
		document.getElementById("passtxtlog").value="Contraseña";
		
	}


	
}
function focustxtPass()
{
	document.getElementById("passtxtlog").style.display="none";
	document.getElementById("passlog").style.display="block";
	document.getElementById("passlog").focus();
}
function xcambiarPass(naUsuario,naContact,naPassword,naPassword2){
	
	var req = getRequestObject();
	var params = "accion=cambiopass&naUsuario="+naUsuario+"&naContact="+naContact+"&naPassword="+naPassword+"&naPassword2="+naPassword2;
 	req.onreadystatechange = function() {showResponsexcambiarPass(req);};
	req.open("POST","Goto",true);
	req.setRequestHeader("Content-type","application/x-www-form-urlencoded");	
	req.send(params);
	return false;
}
function showResponsexcambiarPass(request){
	 if ((request.readyState == 4) && (request.status == 200)) {		 
		 if(request.responseText=="0"){
		  	parent.tb_remove();		  	
		 }else{
			 var iframe = document.getElementById('TB_iframeContent');
			 var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
			 innerDoc.getElementById("trerror").style.visibility="visible";
			 innerDoc.getElementById("xserror").innerHTML=request.responseText;
		 }
	  }
}
function getRequestObject() {
    if (window.XMLHttpRequest)    {        // Si es Mozilla, Safari etc        
       return(new XMLHttpRequest ()); 
    } 
    else if (window.ActiveXObject) {      // pero si es IE        
         try {            
             return(new ActiveXObject ("Msxml2.XMLHTTP"));
         }
         catch (e) {            // en caso que sea una versi�n antigua 
            try {
                return(new ActiveXObject ("Microsoft.XMLHTTP"));
            }
            catch (e) {}
         }
     }
     else {
        return(null);
     } 
}


</script>
</head>

<body onload="<%= (request.getAttribute("cambia_pass")!=null?"tb_show('','cambio_pass.jsp?ok=1&KeepThis=true&TB_iframe=true&height=310&width=300',null)":"")%>">

	<div class="top-bar"></div>
	<div class="login-bar">
		<div class="logo">
			  <img src="images/mgu-web-logo.jpg" alt="mgu-web-logo" width="517" height="68" /> 
			  
			
		</div>
		<div class="form">
			<form action="Login?accion=login" method="post">
			<div style="margin-top: 20px;">
				<input type="text" id ="usserlog" class="input-texto" value="Usuario" name="naUsuario" onfocus="if(this.value=='Usuario')this.value='';" onblur="if(this.value=='')this.value='Usuario';" >
				<input type="text" id ="passtxtlog"  class="input-texto" name="natxtPassword" value="Contraseña" onfocus="focustxtPass()" >
				<input type="password" id ="passlog" style="display:none" class="input-texto" name="naPassword"  onblur="BlurPass()"  >
				<button type="submit" class="input-boton">Ingresar</button>
				<div style="float:right;width:40px"><a id="cambioPass" href="cambio_pass.jsp?ok=1&KeepThis=true&TB_iframe=true&height=310&width=300" class="thickbox" style="text-decoration:none;color:white;font-family: Arial;font-size: 13px;">Cambiar<br/>Contraseña</a></div>
			</div>		
				<div class="contenido-tab" style="display: none;">
				<input type="text" id ="server" class="input-texto" value="Servidor" name="server" onfocus="if(this.value=='Servidor')this.value='';" onblur="if(this.value=='')this.value='Servidor';" >
				<input type="text" id ="base" class="input-texto" value="Base de datos" name="base" onfocus="if(this.value=='Base de datos')this.value='';" onblur="if(this.value=='')this.value='Base de datos';" >
				</div>				
			</form>
       		<div style="height:20px;clear:both"><span style="color:white;background-color:#DD0000;font-family: Arial;font-size: 14px;" id="serror">${xerror}</span></div>
		</div>
	</div>
	<div class="frase">Líder en conocimiento de seguridad.</div>
	<div class="footer">
		<div class="legal">
			 &nbsp;&nbsp;
		</div>
	</div>

</body>
</html>
