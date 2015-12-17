<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<jsp:include page="topi.jsp"></jsp:include>
<body style="background-color: #3c3c3c" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

<%
  if (request.getParameter("ok") != null) request.setAttribute("error", "") ; 
%>
 <form name="formcambiopass" action="" id="fcambiopass" method="post" onsubmit='return parent.xcambiarPass(document.getElementById("idUsuario").value,document.getElementById("idContact").value,document.getElementById("idPassword").value,document.getElementById("idPassword2").value);'>
  <table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td height="20"></td>
      <td></td>
      <td></td>
      <td></td>
      <td height="20"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="3" align="left"><span class="Texto_Blanco" style="font-weight:bold">Cambio de Contrase&ntilde;a</span></td>
      <td></td>
    </tr>
    <tr>
      <td width="20" height="20"></td>
      <td></td>
      <td></td>
      <td align="right" valign="middle"></td>
      <td width="20" height="20"></td>
    </tr>
    <tr>
      <td></td>
      <td class="Texto_Blanco" width="0" align="left" valign="middle">Usuario</td>
      <td width="10" align="left" valign="top"></td>
      <td align="left" valign="middle"><input class="Input_Largo" type="text" id="idUsuario" name="naUsuario"/></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td height="5" align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td class="Texto_Blanco" width="0" align="left" valign="middle">Contrase&ntilde;a Actual</td>
      <td width="10" align="left" valign="top"></td>
      <td align="left" valign="middle"><input class="Input_Largo" type="Password" id="idContact" name="naContact"/></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td height="5" align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td class="Texto_Blanco" align="left" valign="top">Nueva Contrase&ntilde;a</td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"><input class="Input_Largo" type="Password" id="idPassword" name="naPassword"/></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td height="5" align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td class="Texto_Blanco" align="left" valign="top">Repita</td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"><input class="Input_Largo" type="Password" id="idPassword2" name="naPassword2"/></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td height="5" align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td  align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td align="center" valign="top"><input type="submit" name="butok2" value="Cambiar" /></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td height="10" align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td align="left" valign="top"></td>
      <td></td>
    </tr>
  <tr>
      <td></td>
      <td height="5" align="left" colspan="3" class="Texto_Requisitos" valign="top"> 
     <h4>Requisitos de seguridad en la contraseña.</h4>
	
	<br>* Debe contener entre 8 y 12 caracteres.
	<br>* No puede contener datos personales.(Nombre, Apellido)	
	<br>* Debe tener al menos 1 letra mayúscula, 1 letra minúscula y un número.
	<br>* No puede contener espacios en blanco.
	<br>* Solo se permiten letras y números.
	

	</td>
      <td></td>
    </tr>
    <tr>
      <td height="10"></td>
      <td ></td>
      <td></td>
      <td></td>
      <td ></td>
    </tr>
    
      <tr style="visibility: hidden" id="trerror">
        <td height="20" bgcolor="#DD0000"></td>
        <td height="20" colspan="3" align="center" class="Texto_Blanco" bgcolor="#DD0000"><span class="Texto_Blanco" id="xserror">${error}</span></td>
        <td height="20" bgcolor="#DD0000"></td>
      </tr>
    
  </table>
 </form> 
</body>
</html>