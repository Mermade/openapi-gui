function Parameter (title) {
    this.id = generateId()
    this.title = title;
    this.description = '';
    this.required = false;
    this.defaultValue ='';
    this.dataType = 'string';
    this.parameters = [];

    this.load = function(parameterDefinition) {
        this.description = parameterDefinition.description;
        this.required = parameterDefinition.required ? 'true' : 'false';
        this.defaultValue = parameterDefinition.defaultValue;
        this.dataType = parameterDefinition.dataType;
        this.parameters = [];

        angular.forEach(parameterDefinition.parameters, function(subParameterDefinition) {
            parameter = new Parameter(subParameterDefinition.title);
            parameter.load(subParameterDefinition);
            this.push( parameter );
        }, this.parameters);
    }

    this.render = function() {

        var parameters = {}

        angular.forEach(this.parameters, function(parameter) {
            this[parameter.title] = parameter.render();
        }, parameters);

        returnValue = {
            title: this.title,
            description: this.description,
            required: this.required == "true",
            defaultValue: this.defaultValue,
            dataType: this.dataType
        };

        if ( Object.keys(parameters).length > 0 ) {
            returnValue.parameters = parameters;
        }

        return returnValue;
    }
}