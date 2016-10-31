angular
  .module('insude')
  .controller('imprimirCedulaCtrl', imprimirCedulaCtrl);
 
function imprimirCedulaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	this.evento_id = $stateParams.evento;
	
	let part = this.subscribe('participantes',()=>{
		return [{estatus: true
					  ,$and:[ {municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}
										,{evento_id: $stateParams.evento}]
			}]
	});
	
	this.subscribe('buscarNombre',()=>{
		return [{$and:[ {municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}
										,{evento_id: $stateParams.evento }]}]
	});
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: $stateParams.evento}]
	});
	
	this.subscribe('categorias',()=>{
		return [{estatus: true
						 ,evento_id:  $stateParams.evento
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  $stateParams.evento 
		}]
	});

	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
	  },
		municipios : () => {
			return Municipios.find();
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
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					participante.municipio = Municipios.findOne(participante.municipio_id);
					participante.evento = Eventos.findOne(participante.evento_id);
					participante.deporte = Deportes.findOne(participante.deporte_id);
					participante.categoria = Categorias.findOne(participante.categoria_id);	
					
					participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){
							participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields : { nombre : 1}}))
					})
					
				})
			}
		}
		
	});
	
	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Hombre")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Mujer"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
	
};	
