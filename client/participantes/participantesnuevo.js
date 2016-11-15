angular
  .module('insude')
  .controller('ParticipantesNuevoCtrl', ParticipantesNuevoCtrl);
 
function ParticipantesNuevoCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	this.action = true;
	this.participante = {}; 
	
	this.participante.evento_id = $stateParams.id;
	
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
  	  
  this.nuevo = true;	  
  this.nuevoParticipante = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.participante.nombre = "";
  };
	
  this.guardar = function(participante,form)
	{
			
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
	    
	    if (participante.foto == undefined)
	    {
		    toastr.error('Error no se ha cargado la foto del particpante.');
	      return;
	    }
	    console.log(participante);
	    if (participante.curpImagen == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante del CURP del particpante.');
	      return;
	    }
	    if (participante.actaNacimiento == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante del Acta de Nacimiento del particpante.');
	      return;
	    }
	    if (participante.identificacion == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante de la Identificación Oficial del particpante.');
	      return;
	    }
			
			//Obtener las Edades de la Categoria			
			var cat = Categorias.findOne({ _id: participante.categoria_id});
			
			var d = new Date();
			var anioActual = d.getFullYear();
			
			var anioInicio = cat.anioinicio;
			var anioFin = cat.aniofin;

			var EdadMinima = anioActual - anioInicio;	//22
			var EdadMaxima = anioActual - anioFin;    //23
			
			//Obtener la Edad del participante
			
	    var today_year = d.getFullYear();
	    var today_month = d.getMonth();
	    var today_day = d.getDate();
	    var edad = today_year - participante.fechaNacimiento.getFullYear();
			
	    if ( today_month < (participante.fechaNacimiento.getMonth() - 1))
	    {
	        edad--;
	    }
	    if (((participante.fechaNacimiento.getMonth() - 1) == today_month) && (today_day < participante.fechaNacimiento.getDay()))
	    {
	        edad--;
	    }
	    console.log("Final:",edad);
			console.log("Maxima:", EdadMaxima);
			console.log("Minima:", EdadMinima);
			
			
			//Validar la edad del particpante en relación a la categoria
			if (edad >= EdadMinima && edad <= EdadMaxima)
			{
					
					participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
					console.log(participante);
					
					participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
					participante.estatus = true;
					participante.usuarioInserto = Meteor.userId();
					Participantes.insert(participante);
					toastr.success('Guardado correctamente.');
					participante = {};
					$('.collapse').collapse('hide');
					this.nuevo = true;
					$state.go('root.listarparticipantes');
					
					form.$setPristine();
			    form.$setUntouched();

			}	 
			else
			{
					 toastr.error('La edad no corresponde a la categoria verificar por favor.');
					 
			}
			
	};
	
	this.editar = function(id)
	{
	    this.participante = Participantes.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(participante,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = participante._id;
			delete participante._id;		
			participante.usuarioActualizo = Meteor.userId(); 
			Participantes.update({_id:idTemp},{$set:participante});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var participante = Participantes.findOne({_id:id});
			if(participante.estatus == true)
				participante.estatus = false;
			else
				participante.estatus = true;
			
			Participantes.update({_id:id}, {$set : {estatus : participante.estatus}});
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
	
	this.AlmacenaImagen = function(imagen, tipo)
	{
			if (tipo == 1)
					this.participante.foto = imagen;
			else if (tipo == 2)		
					this.participante.curpImagen = imagen;
			else if (tipo == 3)
					this.participante.actaNacimiento = imagen;		
			else
					this.participante.identificacion = imagen;		
						
	}
	
	
	$(document).ready( function() {
		

			$(".Mselect2").select2();
					
			var fileInput1 = document.getElementById('fileInput1');
			var fileInputCurp = document.getElementById('fileInputCurp');
			var fileInputActa = document.getElementById('fileInputActa');
			var fileInputIdentificacion = document.getElementById('fileInputIdentificacion');
			
			var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
			
			
			//JavaScript para agregar la Foto
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
		
							rc.AlmacenaImagen(reader.result, 1);
							//this.folio.imagen1 = reader.result;
							
							fileDisplayArea1.appendChild(img);
							//console.log(fileDisplayArea1);
						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error la Imagen supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
			});
			
			//JavaScript para agregar el Curp Imagen
			fileInputCurp.addEventListener('change', function(e) {
				var file = fileInputCurp.files[0];
				
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
		
				console.log(imageType);
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 512000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
						rc.AlmacenaImagen(reader.result, 2);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			//JavaScript para agregar el Acta Nacimiento
			fileInputActa.addEventListener('change', function(e) {
				var file = fileInputActa.files[0];
				
				console.log(file.type);
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 512000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
							rc.AlmacenaImagen(reader.result, 3);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			//JavaScript para agregar el Identificacion Oficial
			fileInputIdentificacion.addEventListener('change', function(e) {
				var file = fileInputCurp.files[0];
				
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 512000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
							rc.AlmacenaImagen(reader.result, 4);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			

	});
	
	
	
};