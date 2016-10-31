function Method (name) {
    this.id = generateId()
    this.name = name;
    this.description = '';
    this.httpMethod = 'GET';
    this.parameters = [];

    this.load = function(methodDefinition, httpMethod, openApi) {

        this.description = methodDefinition.description;
        this.httpMethod = httpMethod;
        this.parameters = [];

        angular.forEach(methodDefinition.parameters, function(parameterDefinition) {
		    if (parameterDefinition["$ref"]) {
			  parameterDefinition = jptr.get(openApi, parameterDefinition["$ref"]);
			}
            parameter = new Parameter(parameterDefinition.name);
            parameter.load(parameterDefinition);
            this.push( parameter );
        }, this.parameters);
    }

    this.render = function() {
        var parameters = [];

        angular.forEach(this.parameters, function(parameter) {
            //var key = parameter.name.replace(/[^\w]/gi, '')
            //this[key] = parameter.render();
			this.push(parameter.render());
        }, parameters);

        return {
            //name: this.httpMethod.toLowerCase(),
			operationId: this.name,
            description: this.description,
            parameters: parameters
        };
    }
}
