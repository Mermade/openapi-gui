function preProcessDefinition(openapi) {
    for (var t in openapi.tags) {
        var tag = openapi.tags[t];
        if (!tag.externalDocs) tag.externalDocs = {};
    }
    if (!openapi.security) openapi.security = [];
    for (var p in openapi.paths) {
        var path = openapi.paths[p];
        for (var o in path) {
            var op = path[o];
            if (!op.tags) op.tags = [];
            if (path.parameters && path.parameters.length > 0) {
                for (var pp in path.parameters) {
                    var shared = path.parameters[pp];
                    var seen = false;
                    for (var cp in op.parameters) {
                        var child = op.parameters[cp];
                        if (child.name == shared.name && child.in == shared.in) {
                            seen = true;
                            break;
                        }
                    }
                    if (!seen) {
                        op.parameters.push(shared); //? clone it?
                    }
                }
            }
        }
    }
    return openapi;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var openapi;

if (window.localStorage) {
    var o = window.localStorage.getItem('swagger2');
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
                    window.localStorage.setItem('swagger2', JSON.stringify(this.container.openapi));
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
                return def;
            }
        }
    });
}