

Meteor.publish("participantes",function(params){
  	return Participantes.find(params);
});


Meteor.publish("buscarNombre",function(options){
	let selector = {
  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
  	evento_id: options.where.evento_id,
  	municipio_id: options.where.municipio_id
	}
	return Participantes.find(selector, options.options);
});


