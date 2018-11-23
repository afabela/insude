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
			
	this.subscribe('buscarNombreEventos', () => {
		if (this.getReactively('buscar.evento_id') != undefined)
		{			
				
			if ((Meteor.user().roles[0] == 'admin') && (this.getReactively('buscar.municipio_id') == undefined))
					return;
			if (this.getReactively('buscar.nombre') == "")
					return;
			
			if (this.getReactively("buscar.nombre").length > 4)
			{
			    return [{
				    options : { limit: 8 },
				    where : { 
					    nombreCompleto 	: this.getReactively('buscar.nombre'),
					    evento_id 			: this.getReactively('buscar.evento_id'), 
					    municipio_id 		: ((Meteor.user().roles[0] == 'admin') && (this.getReactively('buscar.municipio_id') != undefined)) 
							  									? this.getReactively('buscar.municipio_id')  
							  									: Meteor.user().profile.municipio_id	  
					  }  
			    }];
			}   
    }
  });

  
  this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('buscar.evento_id'),
						 estatus: true}]
	});
	
	this.subscribe('categorias',()=>{
		return [{deporte_id: this.getReactively('buscar.deporte_id'),
						 estatus: true}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});

	
	this.helpers({
	  participantes : () => {
		  return ParticipanteEventos.find();
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
	
	this.eliminar  = function (id){
			
			customConfirm('¿Estás seguro de eliminar al participante del evento seleccionado?', function() {
						
						loading(true);
						
						Meteor.call ("removeParticipanteEventos", rc.buscar.evento_id, id,function(error,result){
								if(error){
									console.log(error);
									toastr.error('Error al eliminar los datos.');
									return
								}
								if (result)
								{
									toastr.success('Eliminado correctamente.');
								}	
						});
						
												
						loading(false);
						
						
						console.log(rc.buscar.evento_id);
						console.log(id);
						
						
						/*
	Meteor.call ("corteCaja",caja.cuenta, caja.usuario_id, caja._id,function(error,result){
						if(error){
							console.log(error);
							toastr.error('Error al guardar los datos.');
							return
						}
						if (result)
						{
							console.log(result);
							toastr.success('Cierre efectuado correctamente.');
							$state.go('root.cajasActivas');						
							
							var url = $state.href("anon.imprimirCorte", { corte_id: result });
							window.open(url, '_blank');
							
						}	
				});
      
    })
*/
			});
			
		
	}
	
};	
