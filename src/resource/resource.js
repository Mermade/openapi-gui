function Resource (name) {
    this.id = generateId()
    this.name = name;
    this.methods = [ new Method('newOperation') ];
}

Resource.prototype.load = function(resourceDefinition) {
    // Clean the slate before we load in data
    this.methods = [];
    
    angular.forEach(resourceDefinition, function(methodDefinition, index) {
	    //var name = resourceDefinition[index].operationId;
        method = new Method(methodDefinition.operationId);
        method.load(methodDefinition, index);
        this.push( method );
    }, this.methods);
};

Resource.prototype.render = function() {
    methods = {}

    angular.forEach(this.methods, function(method) {
        var key = method.operationId.replace(/[^\w]/gi, '');
        this[key] = method.render();
    }, methods);

    return {
        methods: methods
    };
}
