angular
  .module('insude')
  .controller('ParticipantesEditarCtrl', ParticipantesEditarCtrl);
 
function ParticipantesEditarCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	this.action = true;
	this.participante = {}; 
	
	this.participante.evento_id = $stateParams.id;
	
	
	let part = this.subscribe('participantes',()=>{
		
		console.log("ID:",$stateParams.id);
		return [{_id : $stateParams.id}]
	});
	
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('modalidaddeportivas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		
		return [{evento_id: this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):""
						,estatus: true}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):"" 
						,deporte_id: this.getReactively('participante.deporte_id')? this.getReactively('participante.deporte_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):"" 
						,deporte_id: this.getReactively('participante.deporte_id')? this.getReactively('participante.deporte_id'):""			
						,categoria_id: this.getReactively('participante.categoria_id')? this.getReactively('participante.categoria_id'):""
						,rama_id: this.getReactively('participante.rama_id')? this.getReactively('participante.rama_id'):""			
		}]
	});
	
  
  this.helpers({
	  participante : () => {
		  if (part)
		  {
			  var p = Participantes.findOne(); 
			  
			  console.log(p);
			  
			  fileDisplayArea1.innerHTML = "";
			
				var img = new Image();
												
				img.id = "fotoCargada";
				img.src = p.foto;
				img.width =200;
				img.height=200;
												
				fileDisplayArea1.appendChild(img);	
			  
			  
			  return p;
			}  
	  },
	  eventos : () => {
		  return Eventos.find();
	  },
	  deportes : () => {
		  return Deportes.find();
	  },
	  categorias : () => {
		  return Categorias.find();
	  },
	  pruebas : () => {
		  return Pruebas.find();
	  },
	  ramas : () => {
		  return Ramas.find();
	  },
	  modalidaddeportivas : () => {
		  return ModalidadDeportivas.find();
	  },
  });
  	  
  	
	this.actualizar = function(participante,form)
	{
	    if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
	    
	    if (participante.foto == undefined)
	    {
		    toastr.error('Error no se ha cargado la foto del participante.');
	      return;
	    }

	    if (participante.curpImagen == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante del CURP del participante.');
	      return;
	    }
	    if (participante.actaNacimiento == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante del Acta de Nacimiento del participante.');
	      return;
	    }
			var mun = String(Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "");
			//console.log(mun);
			            
	    if (mun != '8mqR9HsyDwG3X7jmp')
	    {	    
			    if (participante.identificacion == undefined)
			    {
				    toastr.error('Error no se ha cargado el comprobante de la Identificación Oficial del particpante.');
			      return;
			    }
	    }
			
			// Enable #x
			$( "#registrar" ).prop( "disabled", true );
	    if (participante.categoria_id != "s/a")
	    {
			
					//Obtener las Edades de la Categoria			
					var cat = Categorias.findOne({ _id: participante.categoria_id});
					
					var d = new Date();
					var anioActual = d.getFullYear();
					
					var anioInicio = cat.anioinicio;
					var anioFin = cat.aniofin;			    
			    var anioNacimiento = participante.fechaNacimiento.getFullYear();
										
					//Validar la edad del particpante en relación a la categoria
					if (participante.funcionEspecifica != 'DEPORTISTA')
					{
						  participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
							participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
							
							var idTemp = participante._id;
							delete participante._id;		
							participante.usuarioActualizo = Meteor.userId(); 
							Participantes.update({_id:idTemp},{$set:participante}, 
																			function(error,result){
																				if (error){
																						$( "#registrar" ).prop( "disabled", false );
																					  console.log("Error:",error);
																				}	  
																				if (result)
																				{
																						toastr.success('Actualizado correctamente.');
																						participante = {};
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						$state.go('root.listarparticipantes');
																						
																						form.$setPristine();
																				    form.$setUntouched();	
																				}	 
																			}
																	);

					}
					else if (anioNacimiento <= anioInicio && anioNacimiento >= anioFin)
					{
							
							participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
							participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
							
							var idTemp = participante._id;
							delete participante._id;		
							participante.usuarioActualizo = Meteor.userId(); 
							Participantes.update({_id:idTemp},{$set:participante}, 
																			function(error,result){
																				if (error){
																						$( "#registrar" ).prop( "disabled", false );
																					  console.log("Error:",error);
																				}	  
																				if (result)
																				{
																						toastr.success('Actualizado correctamente.');
																						participante = {};
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						$state.go('root.listarparticipantes');
																						
																						form.$setPristine();
																				    form.$setUntouched();	
																				}	 
																			}
																	);
					}	 
					else
					{
							 toastr.error('La edad no corresponde a la categoria verificar por favor.');
							 $( "#registrar" ).prop( "disabled", false );
							 return;
							 
					}
			}else
			{
							participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
							participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
							
							var idTemp = participante._id;
							delete participante._id;		
							participante.usuarioActualizo = Meteor.userId(); 
							Participantes.update({_id:idTemp},{$set:participante}, 
																			function(error,result){
																				if (error){
																						$( "#registrar" ).prop( "disabled", false );
																					  console.log("Error:",error);
																				}	  
																				if (result)
																				{
																						toastr.success('Actualizado correctamente.');
																						participante = {};
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						$state.go('root.listarparticipantes');
																						
																						form.$setPristine();
																				    form.$setUntouched();	
																				}	 
																			}
																	);
				
			}			    
	};
		
	
	this.getEvento = function(evento_id)
	{		
			var evento = Eventos.findOne({_id:evento_id});

			if (evento)
				 return evento.nombre;
				 
	};
	
	this.getDeporte = function(rama_id)
	{		
			var deporte = Deporte.findOne({_id:deporte_id});

			if (deporte)
				 return deporte.nombre;
				 
	};
	
	this.getCategoria= function(categoria_id)
	{		
			var categoria = ModalidadDeportivas.findOne({_id:categoria_id});

			if (categoria)
				 return categoria.nombre;
				 
	};
	
	this.AlmacenaImagen = function(imagen)
	{
			this.participante.foto = imagen;
	}
	
	this.download = function(archivo, op) 
  {
		    if (archivo.indexOf("application") > 0)
		    {

			    	var pdf = 'data:application/octet-stream;base64,';
			  		var d = archivo.replace('data:application/pdf;base64,','');  
						var dlnk = document.getElementById('dwnldLnk');
						if (op==1)
							 dlnk.download= "curp.pdf";
						else if (op==2)
							 dlnk.download= "AN.pdf";
						else if (op==3)
							 dlnk.download= "Ide.pdf";
				    dlnk.href = pdf+d;
				    dlnk.click();
		    }else if(archivo.indexOf("image") > 0)
		    {

			    	var jpeg = 'data:image/jpeg;base64,';
			  		var d = archivo.replace('data:image/jpeg;base64,','');  
						var dlnk = document.getElementById('dwnldLnk');
				    if (op==1)
							 dlnk.download= "curp.jpeg";
						else if (op==2)
							 dlnk.download= "AN.jpeg";
						else if (op==3)
							 dlnk.download= "Ide.jpeg";				    
						dlnk.href = jpeg+d;
				    dlnk.click();
		    }
		    else
		    {
			    console.log("no entro")
		    }

	};
	
	
	$(document).ready( function() {
		
			
			
			$(".Mselect2").select2();
					
			var fileInput1 = document.getElementById('fileInput1');
			var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
			
			console.log(this.participante);
			/*
			fileDisplayArea1.innerHTML = "";
		
			var img = new Image();
											
			img.id = "fotoCargada";
			img.src = this.participante.foto;
			img.width =200;
			img.height=200;
											
			fileDisplayArea1.appendChild(img);	
			*/
					
			/*
			var x = document.getElementById("prueba"); 
			var optionVal = new Array();
			for (i = 0; i <  rc.participante.pruebas.length; i++) { 
					optionVal.push(rc.participante.pruebas[i]);
			}
			*/
			
				//JavaScript para agregar la imagen 1
			fileInput1.addEventListener('change', function(e) {
				var file = fileInput1.files[0];
				var imageType = /image.*/;
	
				if (file.type.match(imageType)) {
					
					if (file.size <= 512000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
							fileDisplayArea1.innerHTML = "";
		
							var img = new Image();
							
							
							img.src = reader.result;
							img.width =200;
							img.height=200;
		
							rc.AlmacenaImagen(reader.result);
							//this.folio.imagen1 = reader.result;
							
							fileDisplayArea1.appendChild(img);
							//console.log(fileDisplayArea1);
						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error Imagin supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
			});

	});
	
	
	
};