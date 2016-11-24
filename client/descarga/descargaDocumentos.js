angular
  .module('insude')
  .controller('descargaDocumentosCtrl', descargaDocumentosCtrl);
 
function descargaDocumentosCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	
	let part = this.subscribe('participantes',()=>{
		return [{municipio_id: this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""
						,evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): "" 
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): "" 
						,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): "" 
						,estatus: true				
			}]
	});
	
	/*
	this.subscribe('buscarNombre',()=>{
		return [{$and:[ {municipio_id : this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }]}]
	});
	*/
	
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
		}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});

	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
	  },
		municipios : () => {
			return Municipios.find();
		},
		eventos : () => {
			return Eventos.find();
		},
		deportes : () => {
			return Deportes.find();
		},
		categorias : () => {
			return Categorias.find();
		},
		pruebas : () => {
			return Pruebas.find();
		},
		ramas : () => {
			return Ramas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					participante.municipio = Municipios.findOne(participante.municipio_id);
					participante.evento = Eventos.findOne(participante.evento_id);
					participante.deporte = Deportes.findOne(participante.deporte_id);
					participante.categoria = Categorias.findOne(participante.categoria_id);	
					
					participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){
							participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields : { nombre : 1}}))
					})
					
				})
			}
		}
		
	});
	
  this.download = function(data) {
		
		var pdf = 'data:application/octet-stream;base64,';
    
		
		//console.log(data);
		var d = data.replace('data:application/pdf;base64,','');

		/*
    var a = document.createElement("a"),
        file = new Blob([pdf], {type: 'data:application/octet-stream;base64,'});
        
        
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, 'demo.pdf');
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'demo';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
    */
    
    var dlnk = document.getElementById('dwnldLnk');
    dlnk.download="Curp"+".pdf";
    dlnk.href = pdf+d;

    dlnk.click();

    
	};


	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Masculino")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Femenino"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
	
};	
