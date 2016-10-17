Meteor.publish("participantes",function(params){
  	return Participantes.find(params);
});