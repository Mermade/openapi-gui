function generateId(len) {
    var len = len || 10; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i=0; i < len; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return s;
};

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}