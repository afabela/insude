Meteor.publish("eventos",function(params){
  	return Eventos.find(params);
});


Meteor.publishComposite("eventosComposite", function(options){
	return {
		find() {
			return Eventos.find(options);
		},
		children: [{
			find(evento) {
				return Deportes.find({evento_id : evento._id});
			},
				children: [{
					find(deporte) {
						return Categorias.find({deporte_id: deporte._id});
					},
					children: [{
						find(categoria) {
							return Pruebas.find({categoria_id: categoria._id});
						},
					}]
				}]
		}],
	}
});
