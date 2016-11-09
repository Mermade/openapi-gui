Vue.component('api-resource', {
	props: ['key', 'path', 'index'],
    computed: {
        sanitisePath : function() {
            return this.index.split('/').join('').split('{').join('').split('}').join('');
        },
        hashSanitisePath : function() {
            return '#'+this.computed.sanitisePath();
        }
    },
	data: function() {
		return {}
	},
	template: '#template-resource'
});

/*function Resource (name) {
    this.id = generateId()
    this.name = name;
    this.methods = [ new Method('newOperation') ];
}

Resource.prototype.load = function(resourceDefinition, path, openApi) {
    // Clean the slate before we load in data
    this.methods = [];
    
    angular.forEach(resourceDefinition, function(methodDefinition, index) {
	    if (index != 'parameters') {
		  var opId = methodDefinition.operationId ? methodDefinition.operationId : 
  		    index + path.split('/').join('_');
          method = new Method(opId);
          method.load(methodDefinition, index.toUpperCase(), openApi);
          this.push( method );
		}
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

*/