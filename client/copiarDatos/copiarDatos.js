angular
  .module('insude')
  .controller('CopiarDatosCtrl', CopiarDatosCtrl);
 
function CopiarDatosCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);
	
	window = rc;
	
	rc.eventoOriginal_id = "";
	rc.eventoDestino_id  = "";
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
  
  this.helpers({
		eventos : () => {
		  return Eventos.find();
	  },
  });
  	  
  this.nuevo = true;	  
  this.nuevoEvento = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.evento = {};		
  };
	
  this.guardar = function()
	{
			loading(true);
			Meteor.call('copiarDeportes', rc.eventoOriginal_id, rc.eventoDestino_id, function(error, response) {
								    if(error){
									    console.log('ERROR :', error);
									    loading(false);
									    return;
								    }
							   		//Ya Existe
							 			if (response)
							 			{
								 				loading(false);
								 				toastr.success("Datos Copiados");
								 		}
			});					 			
			
			
	};
	
	
	

};