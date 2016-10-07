
angular
.module("verificaciones")
.controller("importarFoliosCtrl", importarFoliosCtrl);
function importarFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

	
  this.action = true;
  this.foliosArreglo = {};
  
	this.subscribe('folios',()=>{
			return [{}]
	});
	
	this.subscribe('usuarios',()=>{
		return [{"profile.estatus": true, roles: ["Analista"]}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  usuarios: ()=> {
		  return Meteor.users.find({roles : ["Analista"]});
	  }
  });
  
  this.nuevo = true;  
 
	this.cargar = function()
	{	
				//console.log(rc.foliosArreglo);
				//console.log(this.foliosArreglo.Hoja1[0].Nombre);
		
	
		 		   	  
	};
	
	this.guardar = function()
	{	
			if (rc.foliosArreglo.Hoja1.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  
		  for (var i=0; i<rc.foliosArreglo.Hoja1.length;i++)
		  {
					f = {folio:"",nombre:"",fecha:"",ciudad:"",plan:"",estatus:"",analista_id:"",usuarioInserto:""};
					f.folio = rc.foliosArreglo.Hoja1[i].Folio;
					f.nombre = rc.foliosArreglo.Hoja1[i].Nombre;
					f.fecha = new Date(rc.foliosArreglo.Hoja1[i].Fecha);
					f.ciudad = rc.foliosArreglo.Hoja1[i].Ciudad;
					f.plan = rc.foliosArreglo.Hoja1[i].Plan;	
					var usuario = Meteor.users.findOne({"profile.ciudad":rc.foliosArreglo.Hoja1[i].Ciudad});	
					//console.log(usuario._id);		
					f.analista_id = usuario._id;
					f.estatus = "1";
					f.usuarioInserto = Meteor.userId();
					//console.log(f);
					Folios.insert(f);	
		  }	  
		  rc.foliosArreglo = {};
		  toastr.success('Guardado correctamente.');

			$state.go('root.importarfolios');
	};
	
	this.validarExistencia = function(folio){
		var existe = Folios.find(folio).count();
		if(existe == 0)
			return false;
		else
			return true;
	}
	
	this.getAnalista = function(ciudad)
	{		
			console.log(ciudad);
			var usuario = Meteor.users.findOne({"profile.ciudad":ciudad});
			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	this.getAnalista_id = function(ciudad)
	{		
			var usuario = Meteor.users.findOne({"profile.ciudad":ciudad});
			if (usuario)
				 return usuario._id;
				 
	};
	
	var X = XLSX;
	
	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}
		
	function process_wb(wb) {

		var output = {};
		output = JSON.stringify(to_json(wb), 2, 2);
		
		
		//Validar que cuando ya exista un folio
		var folios = Folios.find().fetch();
		rc.foliosArreglo = JSON.parse(output);
		
		console.log("todo",rc.foliosArreglo);
		_.each(rc.foliosArreglo.Hoja1, function(folioArreglo){
			console.log("folioArreglo", folioArreglo);
			_.each(folios, function(folio){
			console.log("folio", folio);
				if(folio.folio == folioArreglo.Folio){
					console.log("si");
					folioArreglo.existe = true;
					
				}
			})
		})
		
	}
	
	var xlf = document.getElementById('xlf');
	function handleFile(e) {

		var files = e.target.files;
		var f = files[0];
		{
			var reader = new FileReader();
			var name = f.name;
			reader.onload = function(e) {
				var data = e.target.result;
				var wb;
				wb = X.read(data, {type: 'binary'});
				process_wb(wb);
			};
			reader.readAsBinaryString(f);
		}
	}
	
	if(xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
	
	
};



