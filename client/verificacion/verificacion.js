angular
.module("verificaciones")
.controller("verificacionCtrl", verificacionCtrl);
function verificacionCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

  this.action = true;
	this.subscribe('folios',()=>{
			return [{estatus: "2",verificador_id: Meteor.user() != undefined ? Meteor.user()._id : ""}]
	});//Estatus 2 :  Asignado

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  }
  });
  
};