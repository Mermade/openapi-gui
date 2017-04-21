function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getParameterByName(name, url) {
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
                var target = (ptr.indexOf('#/definitions/') == 0) ? defs : result;
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

function preProcessDefinition(openapi) {
    for (var t in openapi.tags) {
        var tag = openapi.tags[t];
        if (!tag.externalDocs) tag.externalDocs = {};
    }
    if (!openapi.security) openapi.security = [];
	if (!openapi.info.contact) {
		openapi.info.contact = {};
	}
	if (!openapi.info.license) {
		openapi.info.license = {};
	}
	if (!openapi.externalDocs) {
		openapi.externalDocs = {};
	}
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
    for (var p in openapi.paths) {
        var path = openapi.paths[p];
        for (var o in path) {
            var op = path[o];
            if (!op.tags) op.tags = [];
            if (path.parameters && path.parameters.length > 0) {
                if (!op.parameters) op.parameters = [];
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
		delete path.parameters; // other non-HTTP verb properties are excluded from the nav menu
    }
    return openapi;
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

// or we could wrap jsoneditor in a Vue.js component?
var schemaEditorSave = function() {};
var schemaEditorClose = function() {};

function app_main() {
    var vm = new Vue({
        data: {
            container: {
                openapi: openapi
            },
            importschema : importschema
        },
        el: '#main-container' ,
        methods : {
            save : function() {
                if (window.localStorage) {
                    window.localStorage.setItem('openapi3', JSON.stringify(this.container.openapi));
                }
            },
            postProcessDefinition : function() {
                var def = clone(this.container.openapi);
                for (var p in def.paths) {
                    var path = def.paths[p];
                    for (var o in path) {
                        var op = path[o];
                        if (op.externalDocs && !op.externalDocs.url) {
                            Vue.delete(op, 'externalDocs');
                        }
                        if (op.tags) {
                            if (op.tags.length == 0) {
                                Vue.delete(op, 'tags');
                            }
                            else {
                                Vue.set(op, 'tags', op.tags.filter(onlyUnique));
                            }
                        }
                    }
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
        }
    });
}
