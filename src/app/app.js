function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getUrlParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function recurse(obj,path,cache,callback) {
    if (typeof obj == 'object') {
        callback(obj,path);
        for (var p in obj){
            if (cache.indexOf(obj[p])<0) {
                //cache.push(obj[p]);
                recurse(obj[p],path+p+'/',cache,callback);
                //cache.pop();
            }
        }
    }
}

function deref(obj,defs) {
    var result = clone(obj);
    var changes = 1;
    while (changes>0) {
        changes = 0;
        var cache = [];
        recurse(result,'#/',cache,function(o,path){
            cache.push(o);
            if ((typeof o == 'object') && (o["$ref"])) {
                var ptr = o["$ref"];
                //console.log('  '+ptr+' @ '+path);
                var target = (ptr.indexOf('#/components/') === 0) ? defs : result;
                try {
                    var def = new JSONPointer(ptr.substr(1)).get(target);
                    changes++;
                    // rewrite local $refs
                    recurse(def,'#/',cache,function(o,dpath){
                        if (o["$ref"]) {
                            var newPtr = o["$ref"];
                            if ((ptr+'/').indexOf(newPtr+'/')>=0) {
                                var fixPtr = (newPtr+'/').replace(ptr+'/',path);
                                fixPtr = fixPtr.substr(0,fixPtr.length-1);
                                o["$ref"] = fixPtr;
                            }
                        }
                    });
                    for (var p in def) {
                        o[p] = def[p];
                    }
                    delete o["$ref"];
                }
                catch (ex) {
                    console.log(ex.message);
                    console.log('Could not find $ref '+o["$ref"]);
                }
            }
        });
    }
    return result;
}

function processExtensions(extensions) {
    result = {};
    for (var e=0;e<extensions.length;e++) {
        var ext = extensions[e];
        delete ext.openapiExtensionFormat;
        delete ext.info;
        ext = deref(ext,ext);
        delete ext.components;
        for (var namespace in ext) {
            var ns = namespaces.find(function(e,i,a){
                return e.namespace == namespace;
            });
            if (ns && ns.enabled) {
            for (var si in ext[namespace]) {
                var se = ext[namespace][si];
                var targets = ['*'];
                if (se.oas3 && se.oas3.usage && se.oas3.usage === 'restricted') {
                    targets = se.oas3.objectTypes;
                }
                var definition = {};
                definition.propertyName = si;
                definition.summary = se.summary;
                definition.description = se.description;
                definition.schema = se.schema;
                definition.example = se.example;
                definition.externalDocs = se.externalDocs;
                for (var t=0;t<targets.length;t++) {
                    var target = targets[t];
                    if (!result[target]) result[target] = {namespaces:[],exts:[]};
                    if (result[target].namespaces.indexOf(namespace)<0) {
                        result[target].namespaces.push(namespace);
                    }
                    result[target].exts.push(definition);
                }
            }
            }
        }
    }
    return result;
}

function preProcessDefinition(openapi) {
    if (!openapi) openapi = {};
    for (var t in openapi.tags) {
        var tag = openapi.tags[t];
        if (!tag.externalDocs) tag.externalDocs = {};
    }
	if (!openapi.info) {
		openapi.info = {version:"1.0.0",title:"Untitled"};
	}
	if (!openapi.info.contact) {
		openapi.info.contact = {};
	}
	if (!openapi.info.license) {
		openapi.info.license = {};
	}
	if (!openapi.externalDocs) {
		openapi.externalDocs = {};
	}
    if (!openapi.security) openapi.security = [];
	if (!openapi.servers) openapi.servers = [];
	if (!openapi.paths) {
		openapi.paths = {};
	}
    if (!openapi.components) {
        openapi.components = {};
    }
    if (!openapi.components.links) {
        openapi.components.links = {};
    }
    if (!openapi.components.callbacks) {
        openapi.components.callbacks = {};
    }
    if (!openapi.components.schemas) {
        openapi.components.schemas = {};
    }
    for (var p in openapi.paths) {
        var path = openapi.paths[p];
        for (var o in path) {
			if ('get.post.put.patch.delete.options.head.trace'.indexOf(o)>=0) {
      	     var op = path[o];
       	     if (!op.tags) op.tags = [];
       	     if (!op.parameters) op.parameters = [];
			 if (!op.externalDocs) op.externalDocs = {};
       	     if (path.parameters && path.parameters.length > 0) {
       	         for (var pp in path.parameters) {
       	             var shared = path.parameters[pp];
       	             var seen = false;
       	             for (var cp in op.parameters) {
       	                 var child = op.parameters[cp];
       	                 if (child && child.name == shared.name && child.in == shared.in) {
       	                     seen = true;
       	                     break;
       	                 }
       	             }
       	             if (!seen) {
       	                 op.parameters.push(shared); // TODO resolve whether we should clone it?
       	             }
       	         }
       	     }
       	 }
        }
		delete path.parameters; // other non-HTTP verb properties are excluded from the nav menu
    }
    return openapi;
}

function postProcessPathItem(pi) {
    for (var o in pi) {
        var op = pi[o];
        if (op.externalDocs && !op.externalDocs.url) {
            Vue.delete(op, 'externalDocs');
        }
        if (op.tags) {
            if (op.tags.length === 0) {
                Vue.delete(op, 'tags');
            }
            else {
                Vue.set(op, 'tags', op.tags.filter(onlyUnique));
            }
        }
		if (op.callbacks) {
			for (var c in op.callbacks) {
				var callback = op.callbacks[c];
				for (var e in callback) {
					var exp = callback[e];
					postProcessPathItem(exp);
				}
			}
		}
    }
	return pi;
}

function postProcessDefinition(openapi) {
    var def = clone(openapi);
    for (var p in def.paths) {
		postProcessPathItem(def.paths[p]);
    }
    for (var t in def.tags) {
        var tag = def.tags[t];
        if (tag.externalDocs && !tag.externalDocs.url) {
            Vue.delete(tag, 'externalDocs');
        }
    }
    if (def.externalDocs && !def.externalDocs.url) {
        Vue.delete(def, 'externalDocs');
    }
    if (def.info && def.info.license && !def.info.license.name) {
        Vue.delete(def.info, 'license');
    }
    return def;
}

function convertOpenApi2(schema,callback) {
    var convertUrl;
    if (window.intelligentBackend) convertUrl = '/api/v1/convert';
    else convertUrl = 'https://mermade.org.uk/openapi-converter/api/v1/convert';
    var data = new FormData();
    data.append('source',JSON.stringify(schema));
    $.ajax({
        url:convertUrl,
        type:"POST",
        contentType: false,
        processData: false,
        data:data,
        dataType:"json",
        success: function(schema) {
            callback(schema);
        }
    });
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

var openapi;

if (window.localStorage) {
    var o = window.localStorage.getItem('openapi3');
    if (o) {
        try {
            openapi = JSON.parse(o);
        }
        catch (ex) {}
    }
}
if (typeof openapi === 'undefined') {
    openapi = clone(petstore);
}

openapi = preProcessDefinition(openapi);

var importschema = {};
importschema.text = JSON.stringify(openapi, null, 2);

var semoasa = processExtensions(extensions);

// or we could wrap jsoneditor in a Vue.js component?
var schemaEditorSave = function() {};
var schemaEditorClose = function() {};

function app_main() {
    Vue.use(Buefy, { defaultIconPack: 'fa' });
    Vue.component(Buefy.default.Field.name, Buefy.default.Field);
    Vue.component(Buefy.default.Input.name, Buefy.default.Input);
    Vue.component(Buefy.default.Autocomplete.name, Buefy.default.Autocomplete);
    Vue.component(Buefy.default.Tag.name, Buefy.default.Tag);
    Vue.component(Buefy.default.Taginput.name, Buefy.default.Taginput);
    Vue.use(window.vuelidate.default);
    var vm = new Vue({
        data: {
            container: {
                openapi: openapi
            },
            importschema : importschema,
			specVersion: 'master',
            settings: {
                intelligentbackend: window.intelligentBackend,
                semoasa: semoasa,
                extensions: [],
                currenttab: 'main'
            }
        },
        el: '#main-container',
		validations: {},
        methods : {
		    markdownPreview: function(selector,text) {
			    $('#mdPreview').addClass('is-active');
			    var str = text ? text : $(selector).val();
			    var md = window.markdownit();
			    var result = md.render(str);
			    $('#mdPreviewText').html(result);
			    $('#mdPreviewClose').click(function(){
				    $('#mdPreview').removeClass('is-active');
			    });
		    },
			specLink : function(fragment) {
				return 'https://github.com/OAI/OpenAPI-Specification/blob/'+this.specVersion+'/versions/3.0.1.md'+(fragment ? fragment : '');
			},
            save : function() {
                if (window.localStorage) {
                    window.localStorage.setItem('openapi3', JSON.stringify(this.container.openapi));
                }
                if (this.settings.intelligentbackend) {
                    var data = new FormData();
                    data.append('source',JSON.stringify(this.container.openapi));
                    $.ajax({
                        url:'/store',
                        type:"POST",
                        contentType: false,
                        processData: false,
                        data:data,
                        success: function(result) {
                        }
                    });
                }
            },
            postProcessDefinition : function() {
				return postProcessDefinition(this.container.openapi);
			}
        }
    });
	$(document).ajaxError(function(e, jqxhr, settings, thrownError){
		console.log(JSON.stringify(jqxhr));
	});
	$('#aValidate').click(function(){
		$('.wizDetails').addClass('hidden');
		$('#txtValidation').text('Loading...');
		$('#txtValidation').removeClass('hidden');
        var convertUrl;
        if (window.intelligentBackend) convertUrl = '/api/v1/validate';
        else convertUrl = 'https://mermade.org.uk/openapi-converter/api/v1/validate';
		var data = new FormData();
		data.append('source',JSON.stringify(postProcessDefinition(openapi)));
		$.ajax({
		  url:convertUrl,
		  type:"POST",
		  contentType: false,
		  processData: false,
		  data:data,
		  dataType:"json",
		  success: function(data) {
			$('#txtValidation').text(JSON.stringify(data,null,2));
		  }
		});
	});
	$('#aShinola').click(function(){
		var shinolaUrl = 'https://shinola.herokuapp.com/openapi';
		//var shinolaUrl = 'http://localhost:5678/openapi';
		$.ajax({
		  url:shinolaUrl,
		  type:"POST",
		  data:JSON.stringify(openapi),
		  contentType:"application/json; charset=utf-8",
		  dataType:"text",
		  success: function(data) {
			var newWindow = window.open("", "API Documentation"); //, "width=950, height=750");
			newWindow.document.write(data);
			newWindow.document.close();
		  }
		});
	});
	$('#aCRUD').click(function(){
		$('.wizDetails').addClass('hidden');
		$('#divCRUD').removeClass('hidden');
	});
	$('#aImportSchema').click(function(){
		$('.wizDetails').addClass('hidden');
		$('#divImportSchema').removeClass('hidden');
	});
	$('#btnImportSchema').click(function(){
		var schemaName = $('#txtSchemaName').val();
		if (!schemaName) {
			alert('Schema name is required');
		}
		else {
			var obj = {};
			try {
				obj = jsyaml.safeLoad($('#txtSchema').val(),{json:true});
				Vue.set(openapi.components.schemas,schemaName,obj);
			}
			catch (ex) {
				alert('Error parsing schema'+ex.message);
			}
		}
	});
}

