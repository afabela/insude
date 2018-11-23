angular
.module("insude")
.controller("cantidadPorDeporteCtrl", cantidadPorDeporteCtrl);
function cantidadPorDeporteCtrl($scope, $meteor, $reactive,  $state, toastr) {
	
	let rc = $reactive(this).attach($scope);
	
	window = rc;
	

  this.participante_id = "";
  this.participantes_id = [];
  
		
	let part = this.subscribe('participanteListado',()=>{
		return [{municipio_id: this.getReactively('municipio_id')!= undefined ? this.getReactively('municipio_id'): ""
						,evento_id: this.getReactively('evento_id')!= undefined ? this.getReactively('evento_id'): ""			
			}]
	});
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	let depor = this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento_id')? this.getReactively('evento_id'):""
		}]
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
	  cantidadPorDeporte : () => {
		  
		  if(part.ready() ){
				var arreglo = [];   
			  _.each(this.deportes, function(deporte){

				  arreglo.push(ParticipanteEventos.find({deporte_id : deporte._id}).count());
					
			  });
			  
			  return arreglo;
			}	
 
	  },
	  deportesNombres : () => {
		  deporteNombre = [];
		  if(part.ready()){
			  _.each(this.deportes, function(deporte){
				  console.log(deporte.nombre)
				  var nombre = deporte.nombre;
				  deporteNombre.push(nombre);
			  });
		  }
		  return deporteNombre;
	  },
	  graficaDeportes : () => {
		  
		  data = [];
		  
		  if(part.ready()){
			
				data.push({
				  name: "Registrados",
				  data: rc.cantidadPorDeporte
				});	
			}
			$('#container').highcharts( {
			    chart: { type: 'column' },
			    title: { text: 'Registrados por Deporte' },
			    subtitle: {
								text:"Deportes"
			    },
			    xAxis: {
		        categories: rc.deportesNombres,
		        crosshair: true
			    },
			    yAxis: {
		        min: 0,
		        title: {
		          text: 'Cantidad'
		        }
			    },
			    tooltip: {
		        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		        pointFormat:  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		            					'<td style="color:{series.color};padding:0"><b>{point.y:.0f} </b></td></tr>',
		        footerFormat: '</table>',
		        shared: true,
		        useHTML: true
			    },
			    plotOptions: {
		        column: {
		          pointPadding: 0.2,
		          borderWidth: 0
		        }
			    },
			    series: data
				}
			);
			return data;
	  }
	});
	
};