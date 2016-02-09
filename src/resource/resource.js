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
        method.load(methodDefinition);
        this.push( method );
    }, this.methods);
};

Resource.prototype.render = function() {
    methods = {}

    angular.forEach(this.methods, function(method) {
        methodName = method.name.replace(/[^\w]/gi, '')
        this[methodName] = method.render();
    }, methods);

    return {
        methods: methods
    };
}