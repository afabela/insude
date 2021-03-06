angular
  .module('insude')
  .controller('LoginCtrl', LoginCtrl);
 
function LoginCtrl($scope, $meteor, $reactive, $state, toastr) {
	let rc = $reactive(this).attach($scope);
	
	var myCanvas = document.getElementById("myCanvas");

  this.credentials = {
    username: '',
    password: ''
  };

  this.login = function () {
    $meteor.loginWithPassword(this.credentials.username, this.credentials.password).then(
      function () {
		    
		      var usuario = Meteor.user();
		      
		     	if (Meteor.user().username != "admin" && usuario.profile != undefined && !usuario.profile.estatus )
		      {
			      	toastr.error("Usuario Desactivado");
			      	$state.go('anon.logout');		      	
		      }
		      else
		      {							
		          toastr.success("Bienvenido al Sistema");
	            $state.go('root.home'); 

		      }
			},
			function (error) {
		
	      if(error.reason == "Match failed"){
		      toastr.error("Escriba su usuario y contraseña para iniciar");
	      }else if(error.reason == "User not found"){
		      toastr.error("Usuario no encontrado");
	      }else if(error.reason == "Incorrect password"){
		      toastr.error("Contraseña incorrecta");
	      }        
      }
    )
  }
  

	
}