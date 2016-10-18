angular
  .module('insude')
  .controller('ParticipantesNuevoCtrl', ParticipantesNuevoCtrl);
 
function ParticipantesNuevoCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	
	this.action = true;
	this.participante = {}; 
	
	this.participante.evento_id = $stateParams.id;
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		
		return [{estatus: true, evento_id: this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):""}]
	});
	
	this.subscribe('categorias',()=>{
		return [{estatus: true
						 ,evento_id:  this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):"" 
						 ,deporte_id: this.getReactively('participante.deporte_id')? this.getReactively('participante.deporte_id'):""
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
			console.log(participante);
			
			/*if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			*/
			participante.estatus = true;
			participante.usuarioInserto = Meteor.userId();
			Pruebas.insert(participante);
			toastr.success('Guardado correctamente.');
			participante = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.participantesnuevo');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.participante = Pruebas.findOne({_id:id});
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
			Pruebas.update({_id:idTemp},{$set:participante});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var participante = Pruebas.findOne({_id:id});
			if(participante.estatus == true)
				participante.estatus = false;
			else
				participante.estatus = true;
			
			Pruebas.update({_id:id}, {$set : {estatus : participante.estatus}});
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
	
	
};