function Method (name) {
    this.id = generateId()
    this.name = name;
    this.description = '';
    this.httpMethod = 'GET';
    this.parameters = [];

    this.load = function(methodDefinition, httpMethod) {

        this.description = methodDefinition.description;
        this.httpMethod = httpMethod;
        this.parameters = [];

        angular.forEach(methodDefinition.parameters, function(parameterDefinition) {
            parameter = new Parameter(parameterDefinition.name);
            parameter.load(parameterDefinition);
            this.push( parameter );
        }, this.parameters);
    }

    this.render = function() {
        var parameters = {}

        angular.forEach(this.parameters, function(parameter) {
            var key = parameter.title.replace(/[^\w]/gi, '')
            this[key] = parameter.render();
        }, parameters);

        return {
            name: this.name,
            description: this.description,
            httpMethod: this.httpMethod,
            path: this.path,
            parameters: parameters
        };
    }
}
