function postProcessDefinition(openapi) {
    for (var t in openapi.tags) {
        var tag = openapi.tags[t];
        if (!tag.externalDocs) tag.externalDocs = {};
    }
    if (!openapi.security) openapi.security = [];
    return openapi;
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

openapi = postProcessDefinition(openapi);

var importSchema = '';

function app_main() {
    var vm = new Vue({
        data: {
            openapi: openapi,
            importSchema : importSchema
        },
        el: '#main-container' ,
        methods : {
            save : function() {
                if (window.localStorage) {
                    window.localStorage.setItem('swagger2', JSON.stringify(this.openapi));
                }
            }
        }
    });
}