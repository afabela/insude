angular
.module("verificaciones")
.controller("FoliosCtrl", FoliosCtrl);
function FoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{}]
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
  
  this.nuevo = true;  
  this.nuevoFolio = function()
  {
			this.action = true;
		  this.nuevo = !this.nuevo;
		  this.folio = {}; 
  };
 
	this.guardar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
						
			folio.estatus = "1";//Pendiente
			folio.usuarioInserto = Meteor.userId();
			Folios.insert(folio);
			toastr.success('Guardado correctamente.');
			this.folio = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
			$state.go('root.folios');
		
	};
	
	this.editar = function(id)
	{
	    this.folio = Folios.findOne({_id:id});
			this.action = false;
			$('.collapse').collapse('show');
			this.nuevo = false;
	};
	
	this.actualizar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
			console.log(folio);
			var idTemp = folio._id;
			delete folio._id;		
			folio.usuarioActualizo = Meteor.userId(); 
			Folios.update({_id:idTemp},{$set:folio});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var folio = Folios.findOne({_id:id});
			if(folio.estatus == true)
				folio.estatus = false;
			else
				folio.estatus = true;
			
			Folios.update({_id:id}, {$set : {estatus : folio.estatus}});
	};
	
	this.getAnalista = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
};