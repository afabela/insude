Meteor.methods({
  
  
  getGafetes: function (participantes) {
		
		var fs = Npm.require('fs');
    var Docxtemplater = Npm.require('docxtemplater');
		var JSZip = Npm.require('jszip');
		var ImageModule = Npm.require('docxtemplater-image-module')
		
	
		
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
		
		
		/*
		_.each(participantes, function(participante){
										
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			    var bitmap = new Buffer(participante.foto, 'base64');
			    // write buffer to file
			    fs.writeFileSync(process.cwd()+"/fotos/"+participante.curp+".png", bitmap);
					//participante.foto = process.cwd() + "/fotos/"+participante.curp+".png";
					participante.foto = "foto.png";
				
		})
		*/
		console.log();
		
		var content = fs
    							//.readFileSync("/Users/alfonsoduarte/Documents/Meteor/deporteb/cedula.docx", "binary");
    							.readFileSync(process.cwd()+"/app/server/cedula.docx", "binary");
	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		/*
		doc.setOptions({
		    parser: function(tag) {
		      return {
		        'get': function(scope) {
		          console.log('evaluating', tag, 'in', JSON.stringify(scope));
		          console.log('evaluated to', scope[tag]);
		          if (tag === '.') {
		            return scope;
		          } else {
		            return scope[tag];
		          }
		        }
		      };
		    },
		})
		*/
		
		doc.setData({	evento: "Olimpiada Nacional", municipio: "LOS CABOS", deporte: "Atletismo",
									participantes : [{nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
															  	 {nombre:"Karina",
																		apellidoPaterno:"Cebreros",
																		apellidoMaterno:"Ureta",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BALONCESTO",
																  	foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto2.png" 
															  	 },
															  	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },
																	 {nombre:"Alfonso",
																		apellidoPaterno:"Duarte",
																		apellidoMaterno:"Jiménez",
																		funcionEspecifica:"DEPORTISTA",
																		categoria:"2002-2003",
																		municipio:"LOS CABOS",
																		rama:"Varonil",
																		deporte:"BEISBOL",
																		foto: "/Users/alfonsoduarte/Documents/Meteor/deporteb/foto.png"	
																	 },]	  	 
								});
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(process.cwd()+"/app/server/ceulaSalida.docx",buf);
		
		
		
		
  },
  getCedula: function (participantes) {
		
		var fs = Npm.require('fs');
    var Docxtemplater = Npm.require('docxtemplater');
		var JSZip = Npm.require('jszip');
		var ImageModule = Npm.require('docxtemplater-image-module')
		
	
		
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
						objFalatantes = {_id:"s/a"+i,foto:"",nombre:"-",apellidoPaterno:"-", apellidoMaterno:"-",sexo:"-" ,fechaNacimiento:"-",curp:"-",categoria:"-"};
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
			    fs.writeFileSync(process.cwd()+"/app/server/fotos/"+participante.curp+".png", bitmap);
					participante.foto = process.cwd()+"/app/server/fotos/"+participante.curp+".png";
				}
		})
		
		
		var content = fs
    							.readFileSync(process.cwd()+"/app/server/archivos/cedula.docx", "binary");
	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		doc.setData({	evento: participantes[0].evento, 
									municipio: participantes[0].municipio, 
									deporte: participantes[0].deporte, 
									categoria: participantes[0].categoria,
									participantes});
								
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(process.cwd()+"/app/server/descargas/cedulaSalida.docx",buf);
		
		
		// read binary data
    var bitmap = fs.readFileSync(process.cwd()+"/app/server/descargas/cedulaSalida.pdf");
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
		
		
  },
  
});

