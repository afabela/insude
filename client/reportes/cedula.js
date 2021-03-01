angular
  .module('insude')
  .controller('CedulaCtrl', CedulaCtrl);
 
function CedulaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
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
	this.deporteNombre = "";
	this.categoriaNombre = "";
	
	
	let part = this.subscribe('participanteEventos',()=>{
		
				if (this.getReactively('evento.evento_id') != undefined && this.getReactively('evento.deporte_id') != undefined && this.getReactively('evento.categoria_id') != undefined && this.getReactively('evento.rama_id') != undefined)
				{	
					
						if ((Meteor.user().roles[0] == 'admin') && (this.getReactively('evento.municipio_id') == undefined))
								return;
								
				
				return [{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
							  ,municipio_id : ((Meteor.user().roles[0] == 'admin') && (this.getReactively('evento.municipio_id') != undefined)) 
							  									? this.getReactively('evento.municipio_id')  
							  									: Meteor.user().profile.municipio_id
							  ,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
								,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): ""
							  ,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): ""
							  ,funcionEspecifica: this.getReactively('evento.funcionEspecifica')!= undefined ? this.getReactively('evento.funcionEspecifica'): ""}]
							  
				}			  
	});
	
/*
	let part = this.subscribe('participantesCred',()=>{
		
		
		
		return [{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
					  ,municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""
					  ,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): ""
					  ,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): ""
					  ,funcionEspecifica: this.getReactively('evento.funcionEspecifica')!= undefined ? this.getReactively('evento.funcionEspecifica'): ""
						,estatus: true}]
	});
*/
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
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,deporte_id: this.getReactively('evento.deporte_id')? this.getReactively('evento.deporte_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
						,deporte_id: this.getReactively('evento.deporte_id')? this.getReactively('evento.deporte_id'):""
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): ""
		}]
	});

	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.helpers({
	  participantes : () => {
		  return ParticipanteEventos.find();
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
		ramas : () => {
			return Ramas.find();
		},
		pruebas : () => {
			return Pruebas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				
				_.each(rc.participantes, function(participante){
					var m = Municipios.findOne(participante.municipio_id);
					if (m != undefined)
					{
	 					 participante.municipio = m.nombre;
	 					 
	 				}	 
					var e = Eventos.findOne(participante.evento_id);
					if (e != undefined)
					{
						 participante.evento = e.nombre;
					}	 
					var d = Deportes.findOne(participante.deporte_id);
					if (d != undefined)
					{
							participante.deporte = d.nombre;
							this.deporteNombre = d.nombre;
					}		
					var c = Categorias.findOne(participante.categoria_id);
					if (c != undefined)
					{
							participante.categoria = 	c.nombre;
							this.categoriaNombre = c.nombre;
					}		
					var r = Ramas.findOne(participante.rama_id);
					if (r != undefined)
						 participante.rama = 	r.nombre;	
										
					participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){

							var p = Pruebas.findOne(prueba,{ fields : { nombre : 1}});
							participante.pruebasNombre.push({"nombre": p.nombre});
					})
					
				})
				
			}
		}
		
	});
	
	
	
	this.download = function(participantes) 
  {
	  
		if (participantes.length == 0)
 		{
	 			toastr.error("No hay participantes para generar cédula");
				return;
		}
		
		
		var municipio_id = Meteor.user().profile.municipio_id;
		
		
		loading(true);
		Meteor.call('getCedula', this.evento.evento_id, municipio_id, this.evento.deporte_id, this.evento.categoria_id, this.evento.rama_id, this.evento.funcionEspecifica, function(error, response) {
		   if(error){
		    console.log('ERROR :', error);
		    loading(false);
		    return;
		   }else if (response){
			 	 loading(false);
			 	 downloadFile(response);
		   }
		});
		
		
	};

	
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
