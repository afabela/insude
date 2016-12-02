Meteor.methods({
  
  
  getArchivo: function (participantes) {
		
		var fs = Npm.require('fs');
    var Docxtemplater = Npm.require('docxtemplater');
		var JSZip = Npm.require('jszip');
		var ImageModule = Npm.require('docxtemplater-image-module')
		
	
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					//console.log("Dato Binario:", binaryData);
					return binaryData;
					
			    //return fs.readFileSync(tagValue,'binary');
		}
		
		
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [120,120];
		}
		
		var imageModule=new ImageModule(opts);
		
		
		
		var p = [{
					nombre:"Alfonso",
					apellidoPaterno:"Duarte",
					apellidoMaterno:"Jiménez",
					funcionEspecifica:"DEPORTISTA",
					categoria:"2002-2003",
					municipio:"LOS CABOS",
					rama:"Varonil",
					deporte:"BEISBOL",
					image: process.cwd()+"/foto.png",
				},
				{
					nombre:"puta",
					apellidoPaterno:"madre",
					apellidoMaterno:"sal",
					funcionEspecifica:"DEPORTISTA",
					categoria:"2002-2003",
					municipio:"LOS CABOS",
					rama:"Varonil",
					deporte:"BEISBOL",
					image: process.cwd()+"/foto.png",
				}

		];
		
		
		/*
		var handsets = [{
					extntype:"Alfonso",
					extntotal:"10.00",
					extnoos:"Jiménez",
					extnnonum:"1",
					extndesc:"10",
					extnimg: "/Users/alfonsoduarte/Documents/Meteor/deporteb/.meteor/local/build/programs/server/fotos/foto.png"
				}
		];
		*/

		
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
		var content = fs
    							.readFileSync(process.cwd() + "/gafete.docx", "binary");
 
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
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
		
		
		//doc.setData({p : [{image:process.cwd()+"/foto.png"}]});
									
		
		/*
		doc.setData({nombre:"Alfonso",
																		 apellidoPaterno:"Duarte",
																		 apellidoMaterno:"Jiménez",
																		 funcionEspecifica:"DEPORTISTA",
																		 categoria:"2002-2003",
																		 municipio:"LOS CABOS",
																	 	 rama:"Varonil",
																		 deporte:"BEISBOL",
																		 image:process.cwd()+"/foto.png"
								
									});	
		
		*/
		doc.setData({p});
								
 		//console.log(doc);
		
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(process.cwd()+"/output.docx",buf);
		
		
  },
  
});



/*
		var participantes = [{
					"nombre":"Alfonso",
					"apellidoPaterno":"Duarte",
					"apellidoMaterno":"Jiménez",
					"funcionEspecifica":"DEPORTISTA",
					"categoria":"2002-2003",
					"municipio":"LOS CABOS",
					"rama":"Varonil",
					"deporte":"BEISBOL"
				},{
					"nombre":"Karina",
					"apellidoPaterno":"Cebreros",
					"apellidoMaterno":"Ureta",
					"funcionEspecifica":"DEPORTISTA",
					"categoria":"2002-2003",
					"municipio":"LOS CABOS",
					"rama":"Femenil",
					"deporte":"KARATE"
				},{
					"nombre":"Santiago",
					"apellidoPaterno":"Duarte",
					"apellidoMaterno":"Cebreros",
					"funcionEspecifica":"DEPORTISTA",
					"categoria":"2002-2003",
					"municipio":"LOS CABOS",
					"rama":"Varonil",
					"deporte":"BALONCESTO"
				}];
		*/


