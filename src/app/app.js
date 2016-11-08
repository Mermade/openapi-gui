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


function app_main() {
    var vm = new Vue({
        data: {
            openapi: openapi
        },
        el: '#main-container' 
    });
}