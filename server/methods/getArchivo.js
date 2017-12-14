
Meteor.methods({
  
  getGafetes: function (participantes, municipio, FE, deporte, categoria, rama) { 
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')
		
	  var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		//var produccion = meteor_root+"/web.browser/app/archivos/";
		
		var produccion = "/home/insude/archivos/";
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [100,100];
		}
		
		var imageModule=new ImageModule(opts);
		
		var mun = Municipios.findOne({_id: municipio});
		var dep = Deportes.findOne({_id: deporte});
		var cat = Categorias.findOne({_id: categoria});
		var ram = Ramas.findOne({_id: rama});
		
		_.each(participantes, function(participante){
				if (participante.foto != "")
				{											
					var f = String(participante.foto);
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			    var bitmap = new Buffer(participante.foto, 'base64');
			    // write buffer to file					
					
					//Usando Meteor_root
					fs.writeFileSync(produccion+participante.curp+".png", bitmap);
					participante.foto = produccion+participante.curp+".png";
					
					participante.municipio = mun.nombre;
					participante.deporte = dep.nombre; 
					participante.categoria = cat.nombre;
					participante.rama = ram.nombre;
					
					participante.nombre = participante.nombre.toUpperCase();
					participante.apellidoPaterno = participante.apellidoPaterno.toUpperCase();
					participante.apellidoMaterno = participante.apellidoMaterno.toUpperCase();
					
				}
		})

		
		var content = fs
    							.readFileSync(produccion+"gafete.docx", "binary");
	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		doc.setData({participantes})
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(produccion+"gafeteSalida.docx",buf);
		
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(produccion+"gafeteSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
		
  },
  getCredenciales: function (participantes) { 
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')
		var qr = require('qr-image');
		
		
	  //var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		//var produccion = meteor_root+"/web.browser/app/archivos/";

		var produccion = "/home/insude/archivos/";
		
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [110,110];
		}
		
		var imageModule=new ImageModule(opts);



		_.each(participantes, function(participante){
				if (participante.foto != "")
				{											
					var f = String(participante.foto);
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			    var bitmap = new Buffer(participante.foto, 'base64');
			    // write buffer to file					
					
					//Usando Meteor_root
					fs.writeFileSync(produccion+participante.curp+".png", bitmap);
					participante.foto = produccion+participante.curp+".png";
					
					//QR
					
					var svg_string = qr.imageSync("http://insude.mazoft.com/participantesver/"+participante._id+"/"+participante.evento_id+"/"+participante.deporte_id+"/"+participante.categoria_id+"/"+participante.rama_id, { type: 'png' });		

					var bitmapTemp = new Buffer(svg_string,'base64');
					fs.writeFileSync(produccion+participante._id+".png", bitmapTemp);
					
					participante.qr = produccion+participante._id+".png";					
					
				}
		})

		//console.log(participantes);
		
		var content = fs
    							.readFileSync(produccion+"credencial.docx", "binary");
	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		doc.setData({participantes})
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(produccion+"credencialSalida.docx",buf);
		
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(produccion+"credencialSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
		
  },
  getCedula: function (participantes) {
		
		var fs = Npm.require('fs');
    
		var JSZip = require('jszip');
		var Docxtemplater = require('docxtemplater');
		var ImageModule = require('docxtemplater-image-module');
		var unoconv = require('better-unoconv');
    var future = require('fibers/future');
		
		var meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
		
		var produccion 					= "";
		var produccionFotos 		= "";
		var produccionDescargas = "";
				
		if(Meteor.isDevelopment){
      produccion 					= meteor_root+"/web.browser/app/archivos/";
      produccionFotos 		= meteor_root+"/web.browser/app/fotos/";
      produccionDescargas = meteor_root+"/web.browser/app/descargas/";
    }else{
      produccion 					= "/home/insude/archivos/";
      produccionFotos 		= "/home/insude/fotos/";
      produccionDescargas = "/home/insude/descargas/";
    }
		
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [80,80];
		}
		
		var imageModule=new ImageModule(opts);
		
		var Cantidad = participantes.length;

		if (Cantidad % 8 != 0)
		{
				//Completar cuantos faltan para ...
				var modulo = Math.round(Cantidad % 8);
				var faltantes = 8 - modulo;				
				for (var i = 1; i <= faltantes; i++)
				{
						objFalatantes = {_id:"s/a"+i,foto:"",nombre:"-",apellidoPaterno:"-", apellidoMaterno:"-",sexo:"-" ,fechaNacimiento:"-",curp:"-",funcionEspecifica:"-",categoria:"-"};
						participantes.push(objFalatantes);
				}
		}		 
		
		_.each(participantes, function(participante){
				if (participante.foto != "")
				{						
					participante.fechaNacimiento = participante.fechaNacimiento.getUTCDate() +"-"+ (participante.fechaNacimiento.getUTCMonth()+1) +"-"+ participante.fechaNacimiento.getUTCFullYear();
					
					var f = String(participante.foto);
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			    var bitmap = new Buffer(participante.foto, 'base64');
			    // write buffer to file
			    
			    //fs.writeFileSync(process.cwd()+"/app/server/fotos/"+participante.curp+".png", bitmap);
					//participante.foto = process.cwd()+"/app/server/fotos/"+participante.curp+".png";									
					
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp+".png", bitmap);
					participante.foto = produccionFotos + participante.curp+".png";
					
				}
		})
		
		
		var content = fs
    							.readFileSync(produccion + "cedula.docx", "binary");

	  
		var zip = new JSZip(content);
		var res = new future();
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		var fecha = new Date();
		var f = fecha;
		f = fecha.getUTCDate()+'-'+(fecha.getUTCMonth()+1)+'-'+fecha.getUTCFullYear();//+', Hora:'+fecha.getUTCHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
		
		doc.setData({	evento: participantes[0].evento, 
									municipio: participantes[0].municipio, 
									deporte: participantes[0].deporte, 
									categoria: participantes[0].categoria,
									fechaEmision: f,
									participantes});
								
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(produccionDescargas + "cedulaSalida.docx",buf);

		
		var buf = doc.getZip().generate({ type: "nodebuffer" });
		
		
		var rutaOutput = produccionDescargas + "Cedula" + moment().format('x') + "docx";
    fs.writeFileSync(rutaOutput, buf);
    unoconv.convert(rutaOutput, 'pdf', function(err, result) {
      if(!err){
        fs.unlink(rutaOutput);
        res['return']({ uri: 'data:application/pdf;base64,' + result.toString('base64'), nombre: 'Cedula.pdf' });
      }else{
        res['return']({err: err});
      }
    });
		
		//Convertir a PDF
		
		//unoconv.convert(process.cwd()+"/app/server/descargas/cedulaSalida.docx", 'pdf', function (err, result) {
			// result is returned as a Buffer
		//	fs.writeFile(process.cwd()+"/app/server/descargas/cedulaSalida.pdf", result);
		//});
		
		
		//Pasar a base64
		// read binary data
    //var bitmap = fs.readFileSync(meteor_root+"/web.browser/app/descargas/cedulaSalida.docx");
    
    // convert binary data to base64 encoded string
    //return new Buffer(bitmap).toString('base64');
		
		
		return res.wait();
		
  },
  getExcel: function (participantes) {
	  		
	  		var fs = require('fs');
				var ws_name = "SheetJS";
				
				var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
				
				var produccion = "";
				
				if(Meteor.isDevelopment){
		      produccion = meteor_root+"/web.browser/app/archivos/";
		    }else{
		      produccion = "/home/insude/archivos/";
		    }

				var wscols = [
					{wch:5},
					{wch:15},
					{wch:18},
					{wch:18},
					{wch:20},
					{wch:25},
					{wch:15},
					{wch:20},
					{wch:10},
					{wch:20}
				];
				
				if(typeof require !== 'undefined') 
						XLSX = require('xlsx');
				
				var JSZip = require('jszip');
				
				function Workbook() {
					if(!(this instanceof Workbook)) return new Workbook();
					this.SheetNames = [];
					this.Sheets = {};
				}
				var wb = new Workbook();
				
				function datenum(v, date1904) {
					if(date1904) v+=1462;
					var epoch = Date.parse(v);
					return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
				}
				
				/* convert an array of arrays in JS to a CSF spreadsheet */
				function sheet_from_array_of_arrays(data, opts) {
					var ws = {};
					var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
					for(var R = 0; R != data.length; ++R) {
						for(var C = 0; C != data[R].length; ++C) {
							if(range.s.r > R) range.s.r = R;
							if(range.s.c > C) range.s.c = C;
							if(range.e.r < R) range.e.r = R;
							if(range.e.c < C) range.e.c = C;
							var cell = {v: data[R][C] };
							if(cell.v == null) continue;
							var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
				
							/* TEST: proper cell types and value handling */
							if(typeof cell.v === 'number') cell.t = 'n';
							else if(typeof cell.v === 'boolean') cell.t = 'b';
							else if(cell.v instanceof Date) {
								cell.t = 'n'; cell.z = XLSX.SSF._table[14];
								cell.v = datenum(cell.v);
							}
							else cell.t = 's';
							ws[cell_ref] = cell;
						}
					}
				
					/* TEST: proper range */
					if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
					return ws;
				}
				
				
				var ws = sheet_from_array_of_arrays(participantes);

				/* TEST: add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				
				/* TEST: column widths */
				ws['!cols'] = wscols;
				
				/* write file */
				XLSX.writeFile(wb, produccion+"sheetjs.xlsx");
				
				
				//Pasar a base64
				// read binary data
		    var bitmap = fs.readFileSync(produccion+"sheetjs.xlsx");
		    
		    // convert binary data to base64 encoded string
		    return new Buffer(bitmap).toString('base64');
		
	  		
	},
  
  report: function(params) {
    var Docxtemplater = require('docxtemplater');
    var JSZip = require('jszip');
    var unoconv = require('better-unoconv');
    var future = require('fibers/future');
    var fs = require('fs');
    var objParse = function(datos, obj, prof) {
      if (!obj) {
        obj = {};
      }
      _.each(datos, function(d, dd) {
        var i = prof ? prof + dd : dd;
        if (_.isDate(d)) {
          obj[i] = moment(d).format('DD-MM-YYYY');
        } else if (_.isArray(d)) {
          obj[i] = arrParse(d, []);
        } else if (_.isObject(d)) {
          objParse(d, obj, i + '.');
        } else {
          obj[i] = d;
        }
      });
      return obj
    };

    var arrParse = function(datos, arr) {
      _.each(datos, function(d) {
        if (_.isArray(d)){
          arr.push(arrParse(d, []));
        }else if (_.isObject(d)){
          var obj = objParse(d, {});
          arr.push(obj);
        } else {
          arr.push(!_.isDate(d) ? d : moment(d).format('DD-MM-YYYY'));
        }
      });
      return arr
    };

    params.datos = objParse(params.datos);
    params.datos.fechaReporte = moment().format('DD-MM-YYYY');  
    var templateType = (params.type === 'pdf') ? '.docx' : (params.type === 'excel' ? '.xlsx' : '.docx');
    if(Meteor.isDevelopment){
      var path = require('path');
      var publicPath = path.resolve('.').split('.meteor')[0];
      var templateRoute = publicPath + "public/templates/" + params.templateNombre + templateType;
    }else{
      var publicPath = '/home/casserole/bundle/programs/web.browser/app/';
      var templateRoute = publicPath + "templates/" + params.templateNombre + templateType;
    }

    var content = fs.readFileSync(templateRoute, "binary");
    var res = new future();
    var zip = new JSZip(content);
    var doc = new Docxtemplater().loadZip(zip).setOptions({
      nullGetter: function(part) {
        if (!part.module) {
          return "";
        }
        if (part.module === "rawxml") {
          return "";
        }
        return "";
      }
    });

    doc.setData(params.datos);
    doc.render();
    var buf = doc.getZip().generate({ type: "nodebuffer" });
    
    if (params.type == 'pdf') {
      var rutaOutput = publicPath + (Meteor.isDevelopment ? ".outputs/" : "templates/") + params.reportNombre + moment().format('x') + templateType;
      fs.writeFileSync(rutaOutput, buf);
      unoconv.convert(rutaOutput, 'pdf', function(err, result) {
        if(!err){
          fs.unlink(rutaOutput);
          res['return']({ uri: 'data:application/pdf;base64,' + result.toString('base64'), nombre: params.reportNombre + '.pdf' });
        }else{
          res['return']({err: err});
        }
      });
    } else {
      var mime;
      if (templateType === '.xlsx') {
        mime = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
      res['return']({ uri: 'data:application/' + mime + ';base64,' + buf.toString('base64'), nombre: params.reportNombre + templateType });
    }
    return res.wait();
  }
  
});

