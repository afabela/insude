angular
.module("verificaciones")
.controller("asignaFoliosCtrl", asignaFoliosCtrl);
function asignaFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{estatus: "1"}]//Pendiente
	});
	
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