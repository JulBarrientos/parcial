
function getValueFromApplet(){
// 	document.getElementById("hostname").value = document.getElementById("applet").HostName();
//	document.getElementById("procesador").value = document.getElementById("applet").CpuInf();
//	document.getElementById("ram").value = document.getElementById("applet").Ram();
// 	document.getElementById("disco").value = document.getElementById("applet").Disco();
	
	
	
 	var bat = document.getElementById("applet").ejecutable();
 	document.getElementById("procesador").value = bat[1];
	document.getElementById("hostname").value = bat[0];
	document.getElementById("ram").value = bat[2];
	document.getElementById("disco").value = bat[3];
	document.getElementById("os").value = bat[4];
	document.getElementById("licso").value = bat[5];
	document.getElementById("serieso").value = bat[6];
	document.getElementById("user").value = bat[7].split("\\")[1];
	document.getElementById("office").value = bat[8];
	if (bat[9].indexOf("Chassis") > -1) {
		document.getElementById("serie").value = "";
		document.getElementById("serie").readOnly = false;
		document.getElementById("diverror").innerHTML = "Inrese el Nro. de serie de equipo que figura en el chasis.";
	}
	else 
		document.getElementById("serie").value = bat[9];
 	//document.getElementById("os").value = bat[1] + " "+ bat[2];
 	//document.getElementById("serie").value = bat[0];
 	//document.getElementById("licso").value = document.getElementById("applet").ejecutable();
 	document.getElementById("programas").value = "";
	document.getElementById('spinner').style.display='none';
	
   }
function getListApps(){
	var bat = document.getElementById("applet").ProgramList();
	var param = "";
	for (var i = 0; i < bat.length; i++) {
		param += "&apps="+bat[i];
	}
	param += "&seriesist="+document.getElementById("serie").value;
	$.ajax({
        dataType: "json",
        data: param ,
        url: "Goto?listapps=s",
        cache: false,
        method: 'post',
        success: function(rsp) {
            alert("paso");
        }
    });
	window.open("Goto?listapps=s", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes,  top=30,left=100, width=900, height=350");
}
	function getListAppsHist(){
		var seriesist =document.getElementById("serie").value;
		window.open("Goto?listappshis=s&seriesist="+seriesist, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes,  top=30,left=100, width=900, height=350");
	}
function verSpin(segundos,accion){	
	document.getElementById('spinner').style.display='block';
	switch(accion)
	{
		case "inventario":
							setTimeout(function(){getValueFromApplet();}, segundos*100);
							break;
		case "apps":
							setTimeout(function(){getListApps();}, segundos*100);
							break;
		case "appshis":		
							setTimeout(function(){getListAppsHist();}, segundos*100);
							break;
							
	}
	
	
}

function BajaConsulta()
	{	
				
		if(confirm('Desea eliminar el equipo de: '+document.getElementById("ape").value+","+document.getElementById("nom").value))
		{
			
			document.getElementById('spinner').style.display='block';
			var params ="bajaconsulta=s&seriesist="+document.getElementById("seriesist").value;
			console.log(params);

	    	req.onreadystatechange = function() {showResponseElimConsu(req)};
			req.open("POST","Goto?",true);
			req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			req.send(encodeURI(params));		
				
		}	
			
	}
function showResponseElimConsu(req){
	  if (req.readyState == 4) 
	   { 
	      if (req.status == 200) 
	      { 
	    	  document.getElementById('spinner').style.display='none';
	    	  gotofuncion(2,'consulta');
	      }
      }
	      
}

function BindConsu(id,ntd)
{			
	document.getElementById("numtrselec").value=""+ntd;
    var cantrows = parseInt(document.getElementById("idtablecli").rows.length)-2; // saco la cantidad de filas de la tabla
    if(id=="" && cantrows>0)
    	id=$("#trid_0").eq[0].find("div").html();
    	console.log(id);
    document.getElementById("idconsu").value=id;
       
	for(var i=0;i<cantrows-1;i++){ // las recorro para saber donde esta posisionado		
		if((document.getElementById("trid_"+i).cells[0].id.split("_")[1]==document.getElementById("idconsu").value) || (id=="" && i==0))
		{
			document.getElementById("trid_"+i).classList.add("trselected")//;	.backgroundColor="Silver";
			//document.getElementById("tablacli").scrollTop=document.getElementById("trid_"+i).offsetTop-50;
			ntd=i;
			//console.log("scroll:"+);		
		}else
			document.getElementById("trid_"+i).classList.remove("trselected");	//.style.backgroundColor="White";
			
	}
    id=document.getElementById("trid_"+ntd).cells[6].innerHTML;	
	var url='Goto?bindconsu=s';	
		url+='&seriesist='+id; 
	   if (window.XMLHttpRequest) { 
	      req = new XMLHttpRequest(); 
	   } 
	   else 
	      if (window.ActiveXObject) { 
	         req = new ActiveXObject("Microsoft.XMLHTTP"); 
	      }  
	      req.onreadystatechange =function() {infoCargarListaConsulta(req,cantrows,ntd,id);}; 
	      req.open("GET", url, true); 
	      req.send(""); 	     

}
function BindConsuHist(id,ntd)
{
//	alert (id);
//	alert (ntd);
	document.getElementById("numtrselec").value=""+ntd;
    var cantrows = parseInt(document.getElementById("idtablehist").rows.length)-2; // saco la cantidad de filas de la tabla
    if(id==0)
    	id=document.getElementById("trid_0").cells[0].id.split("_")[1];
    document.getElementById("idconsuhist").value=id;
    $("#idtablehist tr").removeClass("ezActiveRow");        	
	$("#trid_"+ntd).addClass("ezActiveRow");
	
//    id=document.getElementById("trid_"+ntd).cells[0].id.split("_")[1];
	
	var url='Goto?bindconsuhist=s&idconsuhist='+id; 
	   if (window.XMLHttpRequest) { 
	      req = new XMLHttpRequest(); 
	   } 
	   else 
	      if (window.ActiveXObject) { 
	         req = new ActiveXObject("Microsoft.XMLHTTP"); 
	      }  
	      req.onreadystatechange =function() {infoCargarListaConsulta(req,cantrows,ntd,id);}; 
	      req.open("GET", url, true); 
	      req.send(""); 	       

}
function infoCargarListaConsulta(req,cantrows,ntr,op)
{ 
   if (req.readyState == 4) 
   { 
      if (req.status == 200) 
      { 
    	   
        document.getElementById("datosconsulta").innerHTML = req.responseText;                  
      } 
      else 
      { 
         document.getElementById("datosconsulta").innerHTML = "Error"; 
      } 
   } 
} 

function limpiar(indice) {
	if (indice = 1) {
		document.getElementById("cc").value = 0;
		document.getElementById("nom").value = "";
		document.getElementById("ape").value = "";
		document.getElementById("requerimiento").value = "";
		document.getElementById("ccact").checked = false;
		document.getElementById("ccfutu").checked = false;
	}
}
function cargar()
	{
		
		var hostname = document.getElementById("hostname");
		var procesador = document.getElementById("procesador");
		var ram = document.getElementById("ram");
		var disco = document.getElementById("disco");
		var os = document.getElementById("os");
		var licencia = document.getElementById("licso");
		var serie = document.getElementById("serie");
		var serieso = document.getElementById("serieso");
		var office = document.getElementById("office");
		var cc = document.getElementById("cc");
		var nom = document.getElementById("nom");
		var ape = document.getElementById("ape");
		var requerimiento = document.getElementById("requerimiento");
		var observaciones = document.getElementById("obsv");
		var user = 	document.getElementById("user");
		var huboerror = false;
	
	    if ((hostname) && (((hostname.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar un HostName.";
	    } 
       if ((!huboerror) && (user) && ((user.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar un Usuario.";
	    }
	    if ((!huboerror) && (procesador) && ((procesador.value).trim() == "")) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar un Procesador.";
	    } 	     
	    if ((!huboerror) && (ram) && (((ram.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar tama\u00f1o de memoria RAM.";
	    }
	    if ((!huboerror) && (disco) && (((disco.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar alg\u00fan Disco.";
	    }
	    
	    if ((!huboerror) && (os) && (((os.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe especificar Sistema Operativo.";
	    }
	    if ((!huboerror) && (licencia) && (((licencia.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar la Licencia del S.O.";
	    }
	    if ((!huboerror) && (serie) && (((serie.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar el n\u00famero de Serie del Equipo que figura en el chasis.";
	    	serie.style.readOnly = true;
	    }
	    if ((!huboerror) && (serieso) && ((serieso.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar el n\u00famero de Serie del S.O.";
	    }
	     if ((!huboerror) && (office) && ((office.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar la Licencia de Office.";
	    }
	     if ((!huboerror) && (ape) && (document.getElementById("estado").selectedIndex == 0) && ((ape.value).trim()=="")) {	    		    	
		    	huboerror = true;
				document.getElementById("diverror").innerHTML = "Debe ingresar Apellido.";
		    }
	     if ((!huboerror) && (nom) && (document.getElementById("estado").selectedIndex == 0) && ((nom.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar Nombre.";
	    }
		 if ((!huboerror) && (cc) && (document.getElementById("estado").selectedIndex == 0) && ((cc.value).trim()=="" || (cc.value).trim()==0)) {	    		    	
			    	huboerror = true;
					document.getElementById("diverror").innerHTML = "Debe ingresar un Centro de Costo.";
			    }
	     if ((!huboerror) && (requerimiento) && (document.getElementById("estado").selectedIndex == 0) && ((requerimiento.value).trim()=="" || (requerimiento.value).trim()==0)) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar un Requerimiento.";
	    }
	
	   	    		    		    	    
	    if(!huboerror){
			var req;
		    var url = "cargaInventario=s&hostname="+hostname.value+"&procesador="+procesador.value+"&ram="+ram.value+"&disco="+disco.value+"&os="+os.value+"&licencia="+licencia.value+"&seriesist="+serie.value+
		    "&serieso="+serieso.value+"&licoffice="+office.value+"&ape="+ape.value+"&nom="+nom.value+"&usuario="+user.value+"&cc="+cc.value+
		    "&requerimiento="+requerimiento.value+"&observaciones="+observaciones.value+"&estado="+document.getElementById("estado").value+"&apps="+document.getElementById("programas").checked;
		    		    
		    var req = getRequestObject();
		 	req.onreadystatechange = function() {showResponseResulcargar(req)};
			req.open("POST","Goto",true);
			req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			req.send(encodeURI(url));
		    
	    }
	}
function showResponseResulcargar(request) {
	  if ((request.readyState == 4) && (request.status == 200)) {
		 document.getElementById("diverror").innerHTML = request.responseText;
		 document.getElementById('recuperarapps').disabled = false;
	  }
}

	function validarformconsulta()
	{
		var ntr = document.getElementById("numtrselec").value;
		var params ="datosInventario=s&ntr="+ntr;
		var hostname = document.getElementById("hostname");
		params +="&hostname="+hostname.value;
		var procesador = document.getElementById("procesador");
		params+="&procesador="+procesador.value;
		var ram = document.getElementById("ram");
		params+="&ram="+ram.value;
		var disco = document.getElementById("disco");
		params+="&disco="+disco.value;
		var os = document.getElementById("os");
		params+="&os="+os.value;
		var licencia = document.getElementById("licso");
		params+="&licso="+licencia.value;
		var serie = document.getElementById("serie");
		params+="&serie="+serie.value;
		var serieso = document.getElementById("serieso");
		params+="&serieso="+serieso.value;
		var office = document.getElementById("office");
		params+="&office="+office.value;
		var cc = document.getElementById("cc");
		params+="&cc="+cc.value;
		var nom = document.getElementById("nom");
		params+="&nom="+nom.value;
		var ape = document.getElementById("ape");
		params+="&ape="+ape.value;
		var requerimiento = document.getElementById("requerimiento");
		params+="&requerimiento="+requerimiento.value;
		var user = 	document.getElementById("user");
		params+="&user="+user.value;
		var obsv = document.getElementById("obsv");
		params+="&obsv="+obsv.value;
		var xi = document.getElementById("estado").selectedIndex;
		var estado = document.getElementsByTagName("option")[xi].value;		
		params+="&estado="+estado;
		var idconsulta = document.getElementById("idconsulta");
		params+="&idconsulta="+idconsulta.value;
		if(document.getElementById("ccact").checked)
			params+="&ccact=s";
		if(document.getElementById("ccfutu").checked)
			params+="&ccfutu=s"; 
		
		var huboerror = false;
	    if ((hostname) && (((hostname.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar un HostName.";
	    } 
	    if ((!huboerror) && (procesador) && ((procesador.value).trim() == "")) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar un Procesador.";
	    } 	     
	    if ((!huboerror) && (ram) && (((ram.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar el tama\u00f1o de la memoria RAM.";
	    }
	    if ((!huboerror) && (disco) && (((disco.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar alg\u00fan Disco.";
	    }
	    
	    if ((!huboerror) && (os) && (((os.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe especificar su Sistema Operativo.";
	    }
	    if ((!huboerror) && (licencia) && (((licencia.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar la Licencia del S.O.";
	    }
	    if ((!huboerror) && (serie) && (((serie.value).trim() == ""))) {
	    	huboerror = true;
	    	document.getElementById("diverror").innerHTML = "Debe ingresar el n\u00famero de Serie del Sistema que figura en el Chasis.";
	    }
	    if ((!huboerror) && (serieso) && ((serieso.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar el n\u00famero de Serie del S.O.";
	    }
	     if ((!huboerror) && (office) && ((office.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar la Licencia de Office.";
	    }
	      if ((!huboerror) && (cc) && (document.getElementById("estado").selectedIndex == 0)  && ((cc.value).trim()=="" || (cc.value).trim()==0)) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar un Centro de Costo.";
	    }
	       if ((!huboerror) && (nom) && (document.getElementById("estado").selectedIndex == 0) && ((nom.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar Nombre.";
	    }
	       if ((!huboerror) && (ape) && (document.getElementById("estado").selectedIndex == 0) && ((ape.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar Apellido.";
	    }
	       if ((!huboerror) && (requerimiento) && (document.getElementById("estado").selectedIndex == 0) && ((requerimiento.value).trim()=="" || (requerimiento.value).trim()==0)) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar un Requerimiento.";
	    }
	       if ((!huboerror) && (user) && ((user.value).trim()=="")) {	    		    	
	    	huboerror = true;
			document.getElementById("diverror").innerHTML = "Debe ingresar un Usuario.";
	    }
	    if(!huboerror){
	    	document.getElementById('spinner').style.display='block';
	    	req.onreadystatechange = function() {showResponseGrabarConsu(req,ntr)};
			req.open("POST","Goto?",true);
			req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			req.send(encodeURI(params));
	    
	    	
	    }
	}
function showResponseGrabarConsu (req,ntr){
	 if (req.readyState == 4) {
         if (req.status == 200) // OK response
         {
        	 
        	 document.getElementById('spinner').style.display='none';
        	
        	gotofuncion(2,'consulta',ntr);
         }
     }
         
}


function gotofuncion(cdmenu,accion,id,report) {
		document.getElementById("submenu-reportes").style.visibility="hidden";
		for(var i =1; i<=5;i++){
			document.getElementById("A_"+i).style.color='#60605a';		
		}
		document.getElementById("A_"+cdmenu).style.color='#014161';
		/*var req;
	    var url = "Goto?"+accion+"=s&reporte="+report;
	    req = getRequestObject();
	    req.onreadystatechange = function() {GotoFuncion(req,accion,id);};
	    req.open("GET", url, true);
	    req.send(null);*/
		$.get("Goto?"+accion+"=s&reporte="+report,function(data){	
			$("#info").html(data);
			if(accion=='consulta'){            		   
				   setfilter("idtablecli");
				   $("#datosconsulta").innerHTML=spinner();
				   if(id!=null && id!='undefined')
					   	$("#trid_"+id).click();
				   else
					   $("#trid_0").click();
				   
			}            		   
			if(accion=='usuarios'){
				  //if(id!=null && id!=undefined){
					  setfilter('tabla_usuarios');
					  $("#trid_0").click();
				  //}            		              			  
			}
				if(accion=='consultahist'){
				   setfilter("idtablehist");           		       
			    	$("#trid_0").click();
				   
			}		
		});
	
}

function GotoFuncion(req,accion,id){
           if (req.readyState == 4) {
              if (req.status == 200) // OK response
              {
            	   document.getElementById("info").innerHTML = req.responseText;
            	   if(accion=='consulta'){            		   
            		   setfilter("idtablecli");
            		   $("#datosconsulta").innerHTML=spinner();
            		   if(id!=null && id!='undefined')
            			   	$("#trid_"+id).click();
        			   else
        				   $("#trid_0").click();
            		   
            	   }            		   
            	  if(accion=='usuarios'){
            		  //if(id!=null && id!=undefined){
            			  setfilter('tabla_usuarios');
            			  $("#trid_0").click();
            		  //}            		              			  
            	  }
            		  if(accion=='consultahist'){
            		   setfilter("idtablehist");           		       
           		    	$("#trid_0").click();
            		   
            	   }
            		  if(accion == 'reportes'){
            			  setfilter("idtablereport");
            	   }
            		  

              }
              else {
                 alert(req.statusText);
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

function CheckKeys(z,evento)
{

var tecla = 0;
var teclachar;
var teclacheck=/\./;

if(window.event) // IE
{
tecla = evento.keyCode;
}
else if(evento.which) // Netscape/Firefox/Opera
{
tecla = evento.which;
}
teclachar = String.fromCharCode(tecla);
if (z==1) teclacheck = /[\s\d\b\t]/; //sólo números
if (z==2) teclacheck = /(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d/; //fecha día, mes, año
//if (z==2) teclacheck = /[\s\d\/]/; //fecha día, mes, año

if (z==3) teclacheck = /[\s\d\.]/; // dígitos y punto
if (z==4) teclacheck = /[\d\-]/; // dígitos y guion
//if (z==5) teclacheck = /^[^\"\'\:\-\|]*$/; // cualquier cosa sin comillas y sin apóstrofos
if (z==5) teclacheck = /[A-Za-z0-9\,\.áéíóúÁÉÍÓÚñÑ\b\v]/; // sólo letras y numeros
if (z==6) teclacheck = /[A-Z]/; // sólo mayúsculas
if (z==7) teclacheck = /\W/; // todo menos letras
if (z==8) teclacheck = /[\s\d\.\-]/; // dígitos y punto y guion
if (z==9) teclacheck = /[\s\d\,]/; // dígitos y coma
var targetElement = null;
if (typeof evento.target != "undefined")
{
targetElement = evento.target;
}
else
{
targetElement = evento.srcElement;
}

  return teclacheck.test(teclachar);
}
function BindearUsuario(tr,cd_usuario){
	
	var tabla = document.getElementById("tabla_usuarios");
	for(var i =0; i<document.getElementById("tabla_usuarios").rows.length;i++){
		console.log(document.getElementById("tabla_usuarios").rows[i]);
			document.getElementById("tabla_usuarios").rows[i].classList.remove("trselected");								
			if(parseInt(document.getElementById("tabla_usuarios").rows[i].cells[0].innerHTML)==cd_usuario){
				tr =document.getElementById("ntr_"+(i-1));
				
						
		}
	}	
	console.log(tr);
	tr.classList.add("trselected");	
	  var url ="Goto?getusuario=s&cd_usuario="+cd_usuario;
	  var req = getRequestObject();
	  req.onreadystatechange = function() { showResponseBinderUsuario(req); };
	  req.open("GET", url, true);
	  req.send(null);
}

function showResponseBinderUsuario(request) {
	  if ((request.readyState == 4) && (request.status == 200)) {
		    
		  document.getElementById("datosUsuarios").innerHTML=request.responseText;
	  }
}
function CancelarUsuario(){		
	 var url ="Goto?getusuario=s&cancelar=s";
	  var req = getRequestObject();
	  req.onreadystatechange = function() { showResponseBinderUsuario(req); };
	  req.open("GET", url, true);
	  req.send(null);
}

function GrabarUsuario(){		
		document.getElementById('spinner').style.display='block';
		document.getElementById("xerror").innerHTML="";
		var hayerror=false;
		var msj ="";
		if(document.getElementById("id_usuario").value==""){
			hayerror = true;
			msj="Ingrese Usuario!";
		}		
		if(!hayerror && document.getElementById("ape").value==""){
			hayerror = true;
			msj="Ingrese Apellido!";
		}		
		if(!hayerror && document.getElementById("nom").value==""){
			hayerror = true;
			msj="Ingrese Nombre!";			
		}			
		if(!hayerror){			
		 	var url ="grabarUsuario=s&grabar=s&cd_usuario="+document.getElementById("hcdusuario").value+
		 	"&id_usuario="+document.getElementById("id_usuario").value+"&ape="+document.getElementById("ape").value+
		 	"&nom="+document.getElementById("nom").value+(document.getElementById("habilitado").checked?"&habilitado=s":"");	 	
		 	var req = getRequestObject();
		 	req.onreadystatechange = function() {showResponseGrabarUsuario(req)};
			req.open("POST","Goto",true);
			req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			req.send(encodeURI(url));
	 	}else{
	 		document.getElementById('spinner').style.display='none';
	 		document.getElementById("xerror").innerHTML=msj;
	 	}
	 	
			  	  
}
function showResponseGrabarUsuario(request){
	  if ((request.readyState == 4) && (request.status == 200)) {
		  if(request.responseText.split(";")[1]==0){
			  document.getElementById('spinner').style.display='none';
			  gotofuncion(3,'usuarios',request.responseText.split(";")[0]);
			  
		  }
			  
	  }
}
function NuevoUsaurio(){
	  var url ="Goto?getusuario=s&nuevo=s";
	  var req = getRequestObject();
	  req.onreadystatechange = function() { showResponseBinderUsuario(req);};
	  req.open("GET", url, true);
	  req.send(null);
}
function BlanquearPass(cd_usuario){
	document.getElementById("xerror").innerHTML="";
 	var url ="blaquearpass=s&cd_usuario="+cd_usuario;	 	
 	var req = getRequestObject();
 	req.onreadystatechange = function() {showResponseBlanquearPass(req)};
	req.open("POST","Goto",true);
	req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	req.send(url);
}
function showResponseBlanquearPass(request){
	 if ((request.readyState == 4) && (request.status == 200)) {
		 if(request.responseText=="0")
			 document.getElementById("password").value='UFuDTPtZ+00=';	
		else
			document.getElementById("xerror").innerHTML=request.responseText;
	 }
}
function setfilter(tabla) {	
	
		var props = {
				selectable: true,  
				on_keyup: true,			 
				on_keyup_delay: 1200,
				filters_row_index: 1,
				//external_flt_grid: true,
				//external_flt_grid_ids: ['id0','id1','id2','id3','id4','id5','id6','id7'],
				alternate_rows: true,
				loader: true,
				loader_html: '<img src="images/cargando.gif" alt="" style="vertical-align:middle; margin-right:5px;"><span id="\lblStatus\"></span>',
				status_bar: true,
				status_bar_target_id: 'lblStatus',
				msg_filter: 'Filtrando...',
				on_after_filter: function(o){ 
				//var str = "The best things in life are free";
//				if (filas.length == 0)
				var filas = o.GetValidRowsIndex(true);
				if ((filas == null) || (filas.length == 0))
					do_clean(tabla); 
				var patt = new RegExp("none");
				//var res = patt.test(str);
					$("#"+tabla+" tbody").find(".trselected").removeClass("trselected");
					$("#"+tabla+" tbody tr").each(function(iix){
						
						if(iix>0&&!patt.test($(this).attr("style"))){
						 $(this).click();
						 //$(this).addClass("ezActiveRow");
						 
						 
						  return false;				
						}
					});
					
				}
			};
		setFilterGrid(tabla,props);	
		console.log($("#cabecera_tabla th"));
		$("#cabecera_tabla th").each(function(iix){
			var xth = $(this);
			var placeholder = $(xth).html();
			
			$(".fltrow td").each(function(iij){
				if(iix == parseInt($(this).find("input").attr("ct"))){
					$(this).attr("style",$(xth).attr("style"));
					$(this).find("input").attr("placeholder",placeholder.toUpperCase());
				}
			});						
		});
		if(tabla=="idtableapps")
		{
			$("#"+tabla+" tbody tr").each(function(iix){
				if(iix==1){
					$(this).find("td").each(function(j){
						var thx = $(".fltrow td")[j];
						console.log($(thx));
						console.log($(this)[0].clientWidth);
						$(thx).css("width",$(this)[0].clientWidth+"px");//('style','width:'+$(this)[0].clientWidth);
						
					});
					
				}
				
				
			});
		}
		$("#cabecera_tabla").hide();
	}
function do_clean (tabla) {
	var url='';
	if (tabla == 'idtablehist') url += 'Goto?bindconsuhist=s&idconsuhist=0';
	else url += 'Goto?bindconsu=s&seriesist=0';
    req = getRequestObject();
    req.onreadystatechange = function() {Do_Clean(req);};
    req.open("GET", url, true); 
    req.send(""); 	       

}
function Do_Clean (req) {	
	   if (req.readyState == 4) 
	   { 
	      if (req.status == 200) 
	      { 
	    	   
	        document.getElementById("datosconsulta").innerHTML = req.responseText;                  
	      } 
	      else 
	      { 
	         document.getElementById("datosconsulta").innerHTML = "Error"; 
	      } 
	   } 
}
function VerAnterior(){		
	var num = parseInt(document.getElementById("nelemento").value)+1;			
	var ListInventarioHistsize = parseInt(document.getElementById("ListInventarioHistsize").value);
	console.log(num+";"+ListInventarioHistsize);
	if(num<(ListInventarioHistsize)){
		document.getElementById("td_include_hist").innerHTML=spinner();
		setTimeout(function(){			
			var url = "Goto?bindconsu_log=s&num="+num;
			req = getRequestObject();
			req.onreadystatechange = function() {Verbindconsu_log(req);};
			req.open("GET", url, true); 
			req.send(""); 
			document.getElementById("nelemento").value=num;
		},700);
    }    	
}
function VerSiguiente(){
	
	var num = parseInt(document.getElementById("nelemento").value)-1;			
	if(num>=0){
		document.getElementById("td_include_hist").innerHTML=spinner();
		setTimeout(function(){			
			var url = "Goto?bindconsu_log=s&num="+num;
			req = getRequestObject();
			req.onreadystatechange = function() {Verbindconsu_log(req);};
			req.open("GET", url, true); 
			req.send(""); 
			document.getElementById("nelemento").value=num;	    	    
		},700);
	}
}
function Verbindconsu_log(req){
	if (req.readyState == 4){ 
		if (req.status == 200){
			console.log(req);
			document.getElementById("td_include_hist").innerHTML=req.responseText;			
			document.getElementById("hora_log").innerHTML=document.getElementById("hora_logx").value;
		}
	}	     
}


function spinner(){
	return '<div class="spinner">'+
	  '<div class="bounce1"></div>'+
	  '<div class="bounce2"></div>'+
	  '<div class="bounce3"></div>'+
	'</div>';
}
