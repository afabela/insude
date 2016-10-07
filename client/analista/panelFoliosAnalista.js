angular
.module("verificaciones")
.controller("panelFoliosAnalistaCtrl", panelFoliosAnalistaCtrl);
function panelFoliosAnalistaCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

	
  this.action = true;
	this.subscribe('folios',()=>{
			return [{estatus :{$gte:"1",$lt:"6"}, analista_id:  Meteor.userId() }]
	});
		
	this.subscribe('logistica',()=>{
		return [{"profile.estatus": true}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  foliosVisitados : () => {	
		  var visitados = Folios.find({estatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  if(visitados){
			  //console.log(visitados)
			  return Folios.find({estatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  }
	  },
	  foliosVisitadosSegundaVisita : () => {
		  return Folios.find({estatus : "3", verificacionRazon: "No encontrado cliente"}).fetch();
	  },
		foliosNoEncontrados : () => {
		  return Folios.find({estatus : "4"}).fetch();
	  },
	  foliosNoVisitados : () => {
		  return Folios.find({estatus : "5"}).fetch();
	  },
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
						
			folio.estatus = 'Pendiente';
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
			/*if(folio.estatus == true)
				folio.estatus = false;
			else
			*/
			folio.estatus = "6";
			
			Folios.update({_id:id}, {$set : {estatus : folio.estatus}});
	};
	
	this.getAnalista = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	
	this.getVerificador = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};

};