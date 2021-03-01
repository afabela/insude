Meteor.methods({

	copiarDeportes: function(eventoOriginal_id, eventoDestino_id){	
			
			//---------------------------------------------------------------------------------------------------------------
			//Deportes
			//Original
			var deportes = Deportes.find({evento_id: eventoOriginal_id, estatus: true}).fetch();
			
			_.each(deportes, function(d){
				
					var deporte = {};
			    deporte.nombre         = d.nombre;
			    deporte.evento_id      = eventoDestino_id;    
			    deporte.estatus        = d.estatus;
			    deporte.usuarioInserto = d.nombre;
			    
			    Deportes.insert(deporte);				
			});
			//---------------------------------------------------------------------------------------------------------------
			//Categorias
			//Original
			
			deportes = [];			
			deportes = Deportes.find({evento_id: eventoOriginal_id, estatus: true}).fetch();
			_.each(deportes, function(d){
					
						var deporteNuevos = Deportes.find({evento_id: eventoDestino_id, estatus: true}).fetch();
						_.each(deporteNuevos, function(deporteNuevo){			
									if (d.nombre === deporteNuevo.nombre)
			            {
				          		var categorias = Categorias.find({evento_id: eventoOriginal_id, deporte_id: d._id ,estatus: true}).fetch();
				          		_.each(categorias, function(c){
					          				var categoria = {};  
	                          categoria.nombre      						= c.nombre;
	                          categoria.anioinicio  						= c.anioinicio;
	                          categoria.aniofin     						= c.aniofin;
	                          categoria.evento_id   						= eventoDestino_id;
	                          categoria.deporte_id  						= deporteNuevo._id;  
	                          categoria.registrospermitidos     = c.registrospermitidos;
	                          categoria.registrossustituciones  = c.registrossustituciones;
	                          categoria.estatus     						= c.estatus;
	                          categoria.aniofin     						= c.usuarioInserto; 
	                          Categorias.insert(categoria);
				          		});
				          }      
						
						});	
			
			});
			
			
			//---------------------------------------------------------------------------------------------------------------
			//Pruebas
			
			deportes = [];			
			deportes = Deportes.find({evento_id: eventoOriginal_id, estatus: true}).fetch();
			_.each(deportes, function(d){
					
						var deporteNuevos = Deportes.find({evento_id: eventoDestino_id, estatus: true}).fetch();
						_.each(deporteNuevos, function(deporteNuevo){			
									if (d.nombre === deporteNuevo.nombre)
			            {
				          		var categorias = Categorias.find({evento_id: eventoOriginal_id, deporte_id: d._id ,estatus: true}).fetch();
				          		_.each(categorias, function(c){
					          			
					          			var categoriasNuevas = Categorias.find({evento_id: eventoDestino_id, deporte_id: deporteNuevo._id ,estatus: true}).fetch();
					          			_.each(categoriasNuevas, function(categoriaNueva){
						          				
						          				if (c.nombre === categoriaNueva.nombre)
															{	
						          						var pruebas = Pruebas.find({evento_id			: eventoOriginal_id, 
							          																			deporte_id		: d._id,
							          																			categoria_id	: c._id,
							          																			estatus: true}).fetch();
							          					_.each(pruebas, function(p){
								          							
								          							var prueba = {};
								          							prueba.nombre 				= p.nombre;
								          							prueba.evento_id 			= eventoDestino_id;
								          							prueba.deporte_id 		= deporteNuevo._id;
								          							prueba.categoria_id 	= categoriaNueva._id;
								          							prueba.rama_id				= p.rama_id;
								          							prueba.estatus				= p.estatus;
								          							prueba.usuarioInserto	= p.usuarioInserto;
								          							Pruebas.insert(prueba);								          							
								          				});															

						          				}		

						          		});				
				          		});
				          }      
						});	
			});
			
			
			return true;
	},
	
  
});
