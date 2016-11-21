

Meteor.publish("participantes",function(params){
  	return Participantes.find(params);
});


Meteor.publish("buscarNombre",function(options){
	let selector = {
  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
  	evento_id: options.where.evento_id,
  	deporte_id: options.where.deporte_id,
  	categoria_id: options.where.categoria_id,
  	rama_id: options.where.rama_id,
  	municipio_id: options.where.municipio_id
	}
	return Participantes.find(selector, options.options);
});


