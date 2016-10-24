angular
  .module('insude')
  .controller('ListarParticipantesCtrl', ListarParticipantesCtrl);
 
function ListarParticipantesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	/*
	this.subscribe('participantes',()=>{
		return [{municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}]
	});
	*/
	
	this.subscribe('buscarNombre', () => {
    return [{
	    options : { limit: 20 },
	    where : { 
		    nombreCompleto : this.getReactively('buscar.nombre'),
		    municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""	  
		  }  
    }];
  });
	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
	  },
	});
	
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
	
};	
