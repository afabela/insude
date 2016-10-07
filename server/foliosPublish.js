Meteor.publish("folios",function(params){
  	return Folios.find(params);
});




Meteor.publish("buscarFolio",function(options){
	let selector = {
  	folio: { '$regex' : '.*' + options.where.folio || '' + '.*', '$options' : 'i' }
	}
	
	//Counts.publish(this, 'number-folios',Folios.find({}),{noReady: true});	
	
	console.log(selector);
	return Folios.find(selector, options.options);
});
