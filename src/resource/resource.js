function Resource (name) {
    this.id = generateId()
    this.name = name;
    this.methods = [ new Method('newOperation') ];
}

Resource.prototype.load = function(resourceDefinition, path) {
    // Clean the slate before we load in data
    this.methods = [];
    
    angular.forEach(resourceDefinition, function(methodDefinition, index) {
		var opId = methodDefinition.operationId ? methodDefinition.operationId : 
		  index + path.split('/').join('_');
        method = new Method(opId);
        method.load(methodDefinition, index.toUpperCase());
        this.push( method );
    }, this.methods);
};

Resource.prototype.render = function() {
    methods = {}

    angular.forEach(this.methods, function(method) {
        //var key = method.name.replace(/[^\w]/gi, '');
        var key = method.httpMethod.toLowerCase();
        this[key] = method.render();
    }, methods);

    //return {
    //    methods: methods
    //};
	return methods;
}
