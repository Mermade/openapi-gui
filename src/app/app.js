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

for (var t in openapi.tags) {
    var tag = openapi.tags[t];
    if (!tag.externalDocs) tag.externalDocs = {};
}

function app_main() {
    var vm = new Vue({
        data: {
            openapi: openapi
        },
        el: '#main-container' 
    });
}