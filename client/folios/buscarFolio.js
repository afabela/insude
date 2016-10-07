angular
.module("verificaciones")
.controller("buscarFolioCtrl", buscarFolioCtrl);
function buscarFolioCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	
	this.buscar = {};
	this.buscar.folio = '';
	
	this.subscribe('buscarFolio', () => {
    return [{
	    options : { limit: 20 },
	    where : { 
		    folio : this.getReactively('buscar.folio') 		  
		  }  
    }];
  });

	/*
	this.subscribe('folios',()=>{
			return [{folio: this.getReactively('folio')}]
	});
	*/
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  usuarios: ()=> {
		  return Meteor.users.find({roles : ["Analista"]});
	  }
  });
  

	

	this.getAnalista = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
};