Meteor.publish("usuarios",function(params){
  	return Meteor.users.find(params);
});
