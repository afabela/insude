

Meteor.publish("participantes",function(params){
  	return Participantes.find(params);
});

Meteor.publish("participantesCred",function(params){
  	return Participantes.find(params, {fields: { _id:1
	  																						,nombre:1
	  																						,apellidoPaterno:1
	  																						,apellidoMaterno:1
	  																						,nombreCompleto:1
	  																						,curp:1
	  																						,foto:1
	  																						,evento_id:1
	  																						,municipio_id:1
	  																						,deporte_id:1
	  																						,categoria_id:1
	  																						,rama_id:1
	  																						,funcionEspecifica:1
	  																						,fechaNacimiento:1
	  																						,sexo:1
	  																						,pruebas:1
	  																						}});
});

/*
Meteor.publish("participantesListado",function(params){
  	return Participantes.find(params, {fields: { _id:1
	  																						,nombre:1
	  																						,apellidoPaterno:1
	  																						,apellidoMaterno:1
	  																						,nombreCompleto:1
	  																						,curp:1
	  																						,evento_id:1
	  																						,municipio_id:1
	  																						,deporte_id:1
	  																						,categoria_id:1
	  																						,rama_id:1
	  																						,funcionEspecifica:1
	  																						,fechaNacimiento:1
	  																						,sexo:1
	  																						,pruebas:1
	  																						}});
});
*/


Meteor.publish("buscarPorNombreCompleto",function(options){
	if (options != undefined)
			if(options.where.nombreCompleto.length > 0){
					let selector = {
				  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
				  }
				  				
					return Participantes.find(selector, { fields: {nombreCompleto: 1, municipio_id: 1 }, limit: 20} );
			}
		
});

Meteor.publish("buscarPorNombre",function(options){
	if (options != undefined)
			if(options.where.nombreCompleto.length > 0){
					let selector = {
						municipio_id: options.where.municipio_id,
				  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
				  }
				  				
					return Participantes.find(selector, { fields: {nombreCompleto: 1, curp: 1 }}, options.options);
			}
			
});

Meteor.publish("buscarNombre",function(options){
	
	if (options != undefined)
	{
			let selector = {		  	
		  	municipio_id: options.where.municipio_id,
		  	evento_id: options.where.evento_id,
		  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
		  	
			}

			return Participantes.find(selector, {fields: { nombre: 1,apellidoPaterno:1,apellidoMaterno:1, foto: 1, _id: 1 }} );
		}
				  																						
});

Meteor.publish("buscarNombreNuevo",function(options){

	if (options != undefined)
	{
			let selector = {
		  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
		  	municipio_id: options.where.municipio_id
			}

			return Participantes.find(selector, {fields:{ _id:1
												  																						,nombre:1
												  																						,apellidoPaterno:1
												  																						,apellidoMaterno:1
												  																						,curp:1
												  																						,foto:1
												  																						,evento_id:1
												  																						,municipio_id:1
												  																						,deporte_id:1
												  																						,categoria_id:1
												  																						,rama_id:1
												  																						,funcionEspecifica:1
												  																						,fechaNacimiento:1
												  																						,sexo:1
												  																						,pruebas:1
												  																						}},options.options);
	}											  																						
});



