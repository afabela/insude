angular
  .module('insude')
  .controller('ImpresionesCtrl', ImpresionesCtrl);
 
function ImpresionesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
	this.validation = false;
	this.carga = false;
	
	rc.participantes = [];
	
	
	/*
	let part = this.subscribe('participantes',()=>{
		return [{$and:[ {municipio_id: this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }
										,{deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): "" }
										,{categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): "" }]
						,estatus: true				
			}]
	});
	*/
	
	/*
let part = this.subscribe('participanteEventos',()=>{
		return [{municipio_id: this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""
						,evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): "" 
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): "" 
						,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): "" 
			}]
	});
*/
	
	/*
	this.subscribe('buscarNombre',()=>{
		return [{$and:[ {municipio_id : this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }]}]
	});
	*/
	
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,estatus: true}]
	});
	
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
		}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});

	
	this.helpers({
	 /*
 participantes : () => {
		  return ParticipanteEventos.find();
	  },
*/
		municipios : () => {
			return Municipios.find({}, {sort : {nombre:1}} );
		},
		eventos : () => {
			return Eventos.find({}, {sort : {nombre:1}} );
		},
		deportes : () => {
			return Deportes.find({}, {sort : {nombre:1}} );
		},
		categorias : () => {
			return Categorias.find({}, {sort : {nombre:1}} );
		},
		pruebas : () => {
			return Pruebas.find({}, {sort : {nombre:1}} );
		},
		ramas : () => {
			return Ramas.find({}, {sort : {nombre:1}} );
		},
		/*
todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					participante.imprimir = true;
					
				})
				
			}
		}		
*/
	});
	
	 
  this.download = function(participantes, op) 
  {
	  
	  var p = rc.participantes.filter(function(ele){
																						return ele.imprimir === true;
		});

	  
		if (p.length == 0)
 		{
	 			toastr.error("No hay participantes seleccionados para imprmir");
				return;
		}
		
		
		if (op == 1)
		{
				loading(true);
				Meteor.call('getCredenciales', p,
																			 rc.evento.evento_id, 
																			 rc.evento.municipio_id, 
																			 rc.evento.deporte_id, 
																			 rc.evento.categoria_id, 
																			 rc.evento.rama_id, function(error, response) {
				   if(error){
					 	loading(false);
				    console.log('ERROR :', error);
				    return;
				   }
				   if (response)
					 {	
						 	loading(false);
						  function b64toBlob(b64Data, contentType, sliceSize) {
								  contentType = contentType || '';
								  sliceSize = sliceSize || 512;
								
								  var byteCharacters = atob(b64Data);
								  var byteArrays = [];
								
								  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
								    var slice = byteCharacters.slice(offset, offset + sliceSize);
								
								    var byteNumbers = new Array(slice.length);
								    for (var i = 0; i < slice.length; i++) {
								      byteNumbers[i] = slice.charCodeAt(i);
								    }
								
								    var byteArray = new Uint8Array(byteNumbers);
								
								    byteArrays.push(byteArray);
								  }
								    
								  var blob = new Blob(byteArrays, {type: contentType});
								  return blob;
							}
							
							var blob = b64toBlob(response, "application/docx");
						  var url = window.URL.createObjectURL(blob);
						  
						  var dlnk = document.getElementById('dwnldLnkG');
					    dlnk.download = "credendiales.docx"; 
							dlnk.href = url;
							dlnk.click();		    
						  window.URL.revokeObjectURL(url);
						  $( "#registrar1" ).prop( "disabled", false );
		
				   }
				});
			
		}
		else if (op == 2)
		{
	  		//console.log(rc.participantes);
				loading(true);
				Meteor.call('getGafetes', p, 
																	rc.evento.evento_id, 
																	rc.evento.municipio_id, 
																	rc.evento.deporte_id, 
																	rc.evento.categoria_id, 
																	rc.evento.rama_id, function(error, response) {
				   if(error){
					  loading(false);
				    console.log('ERROR :', error);
				    return;
				   }
				   if (response)
					 {	
							loading(false);
							//downloadFile(response);
						  function b64toBlob(b64Data, contentType, sliceSize) {
								  contentType = contentType || '';
								  sliceSize = sliceSize || 512;
								
								  var byteCharacters = atob(b64Data);
								  var byteArrays = [];
								
								  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
								    var slice = byteCharacters.slice(offset, offset + sliceSize);
								
								    var byteNumbers = new Array(slice.length);
								    for (var i = 0; i < slice.length; i++) {
								      byteNumbers[i] = slice.charCodeAt(i);
								    }
								
								    var byteArray = new Uint8Array(byteNumbers);
								
								    byteArrays.push(byteArray);
								  }
								    
								  var blob = new Blob(byteArrays, {type: contentType});
								  return blob;
							}
							
							var blob = b64toBlob(response, "application/docx");
						  var url = window.URL.createObjectURL(blob);
						  
						  //console.log(url);
						  var dlnk = document.getElementById('dwnldLnkG');
					    dlnk.download = "Gafetes.docx"; 
							dlnk.href = url;
							dlnk.click();		    
						  window.URL.revokeObjectURL(url);
						  $( "#registrar2" ).prop( "disabled", false );
		
				   }
				});
		}		
	};

	
	this.buscar = function(form){
			
			if(form.$invalid){
	      toastr.error('Seleccione todos los campos.');
	      return;
	    }
			
			loading(true);
				Meteor.call('getParticipanteEventos',
																	rc.evento.municipio_id, 
																	rc.evento.evento_id, 
																	rc.evento.deporte_id, 
																	rc.evento.categoria_id, 
																	rc.evento.rama_id, 
																	function(error, response) {
				   if(error){
					  loading(false);
				    console.log('ERROR :', error);
				    return;
				   }
				   if (response)
					 {	
							loading(false);
							//console.log('res :', response);
							rc.participantes = response;
							
							_.each(rc.participantes,function(p){
								p.imprimir = true;
							});
							$scope.$apply();
				   }
				});		
  }
	
	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Masculino")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Femenino"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
  
  this.cambiar = function() 
  {
				var chkImprimir = document.getElementById('todos');
				

				_.each(rc.participantes, function(participante){
					participante.imprimir = chkImprimir.checked;
				})

		 			
	};
	
};	
