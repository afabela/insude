angular
  .module('insude')
  .controller('EventosMostarrCtrl', EventosMostarrCtrl);
 
function EventosMostarrCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	
	this.subscribe('eventos',()=>{
		return [{estatus:true}]
	});
  
  this.helpers({
		eventos : () => {
		  return Eventos.find();
	  }
  });
  	    
};