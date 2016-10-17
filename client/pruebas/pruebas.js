angular
  .module('insude')
  .controller('PruebasCtrl', PruebasCtrl);
 
function PruebasCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	this.action = true;
	this.prueba = {}; 
	
	if ($stateParams.id)
	{

			//console.log(this.prueba);
			this.prueba.categoria_id = $stateParams.id;
			this.prueba.evento_id = $stateParams.evento_id;
			this.prueba.deporte_id = $stateParams.deporte_id;
			this.prueba.rama_id = $stateParams.rama_id;
	}

	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		
		return [{estatus: true, evento_id: this.getReactively('prueba.evento_id')? this.getReactively('prueba.evento_id'):""}]
	});
	
	this.subscribe('categorias',()=>{
		return [{estatus: true
						 ,evento_id:  this.getReactively('prueba.evento_id')? this.getReactively('prueba.evento_id'):"" 
						 ,deporte_id: this.getReactively('prueba.deporte_id')? this.getReactively('prueba.deporte_id'):""
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('prueba.evento_id')? this.getReactively('prueba.evento_id'):"" 
						 ,deporte_id: this.getReactively('prueba.deporte_id')? this.getReactively('prueba.deporte_id'):""			
						 ,categoria_id: this.getReactively('prueba.categoria_id')? this.getReactively('prueba.categoria_id'):""
						 ,rama_id: this.getReactively('prueba.rama_id')? this.getReactively('prueba.rama_id'):""			
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
  this.nuevoPrueba = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.prueba.nombre = "";
  };
	
  this.guardar = function(prueba,form)
	{
			console.log(prueba);
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			prueba.estatus = true;
			prueba.usuarioInserto = Meteor.userId();
			Pruebas.insert(prueba);
			toastr.success('Guardado correctamente.');
			prueba = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.pruebas');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.prueba = Pruebas.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(prueba,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = prueba._id;
			delete prueba._id;		
			prueba.usuarioActualizo = Meteor.userId(); 
			Pruebas.update({_id:idTemp},{$set:prueba});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var prueba = Pruebas.findOne({_id:id});
			if(prueba.estatus == true)
				prueba.estatus = false;
			else
				prueba.estatus = true;
			
			Pruebas.update({_id:id}, {$set : {estatus : prueba.estatus}});
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