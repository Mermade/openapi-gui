function Resource (name) {
    this.id = generateId()
    this.name = name;
    this.methods = [ new Method('New Method') ];
}

Resource.prototype.load = function(resourceDefinition) {
    // Clean the slate before we load in data
    this.methods = [];
    
    angular.forEach(resourceDefinition.methods, function(methodDefinition) {
        method = new Method(methodDefinition.name);
        method.load(methodDefinition, methodDefinition.name);
        this.push( method );
    }, this.methods);
};

Resource.prototype.render = function() {
    methods = {}

    angular.forEach(this.methods, function(method) {
        var key = method.name.replace(/[^\w]/gi, '');
        this[key] = method.render();
    }, methods);

    return {
        methods: methods
    };
}
