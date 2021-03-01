Meteor.methods({

	getDeportes: function(id){	
			var arreglo = Deportes.find({evento_id: id}).fetch();	
			return arreglo;
	},
	getCategorias: function(id){	
			var arreglo = Categorias.find({deporte_id: id}).fetch();	
			return arreglo;
	},
	getPruebas: function(id){	
			var arreglo = Pruebas.find({categoria_id: id}).fetch();	
			return arreglo;
	},
	
	setMunicipio: function(id, municipio_id){	
			Participantes.update({_id : id}, {$set: {municipio_id : municipio_id}});	
			return true;
	},
	
});