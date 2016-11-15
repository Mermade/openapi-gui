function preProcessDefinition(openapi) {
    for (var t in openapi.tags) {
        var tag = openapi.tags[t];
        if (!tag.externalDocs) tag.externalDocs = {};
    }
    if (!openapi.security) openapi.security = [];
    return openapi;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

var openapi = clone(petstore);

if (window.localStorage) {
    var o = window.localStorage.getItem('swagger2');
    if (o) {
        try {
            openapi = JSON.parse(o);
        }
        catch (ex) {}
    }
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