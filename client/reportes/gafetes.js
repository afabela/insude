angular
  .module('insude')
  .controller('GafetesCtrl', GafetesCtrl);
 
function GafetesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
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
	
	
	this.subscribe('participantes',()=>{
		return [{estatus: true
					  ,$and:[ {municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }]
			}]
	});
	
	/*
	this.subscribe('buscarNombre',()=>{
		return [{$and:[ {municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }]}]
	});
	*/
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""}]
	});
	
	this.subscribe('categorias',()=>{
		return [{estatus: true
						 ,evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
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
	});
	
	this.getMunicipio = function(id)
	{		
		//console.log(usuario_id);
			var municipio = Municipios.findOne({_id:id});

			if (municipio)
				 return municipio.nombre;
				 
	};
	
	this.getEvento = function(id)
	{		
		//console.log(usuario_id);
			var evento = Eventos.findOne({_id:id});

			if (evento)
				 return evento.nombre;
				 
	};
	
	
	this.getDeporte = function(id)
	{		
		//console.log(usuario_id);
			var deporte = Deportes.findOne({_id:id});

			if (deporte)
				 return deporte.nombre;
				 
	};
	
	
	this.getCategoria = function(id)
	{		
		//console.log(usuario_id);
			var categoria = Categorias.findOne({_id:id});

			if (categoria)
				 return categoria.nombre;
				 
	};
	
	
	this.getPrueba = function(id)
	{		
		//console.log(usuario_id);
			var prueba = Pruebas.findOne({_id:id});

			if (prueba)
				 return prueba.nombre;
				 
	};

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
