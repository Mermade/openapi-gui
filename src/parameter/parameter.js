function Parameter (title) {
    this.id = generateId();
    this.location = 'body';
    this.title = title;
    this.description = '';
    this.required = 'false';
    this.default ='';
    this.type = 'string';
    this.properties = [];

    this.load = function(parameterDefinition) {
        this.description = parameterDefinition.description;
        this.required = parameterDefinition.required ? 'true' : 'false';
        this.default = parameterDefinition.default;
        this.type = parameterDefinition.type;
        this.location = parameterDefinition.location;
        this.properties = [];

        var properties = [];

        if ( this.type === 'array' && parameterDefinition.items !== undefined ) {
            groupingProperty = new Property( parameterDefinition.items.title )
            groupingProperty.description = parameterDefinition.items.description;
            groupingProperty.required = parameterDefinition.items.required;
            groupingProperty.default = parameterDefinition.items.default;
            groupingProperty.type = parameterDefinition.items.type;
            groupingProperty.properties = parameterDefinition.items.properties;
            var properties = [groupingProperty];
        }
        else {
            var properties = parameterDefinition.properties;
        }

        angular.forEach(properties, function(propertyDefinition) {
            var property = new Property(propertyDefinition.title);
            property.load(propertyDefinition);
            this.push( property );
        }, this.properties);
    }

    this.render = function() {
            
        var val = {
            title: this.title,
            description: this.description,
            required: this.required == "true",
            default: this.default,
            type: this.type,
            location: this.location
        };

        if ( Object.keys(this.properties).length > 0 ) {
            if ( this.type === 'array' ) {
                // Unfortunately IO/Docs doesn't fully support json schema v4
                // so this hack sets the first element in the list to be the
                // only item
                val.items = this.properties[0].render() ;
            }
            else {
                val.properties = {};

                angular.forEach(this.properties, function(property) {
                    var key = property.title.replace(/[^\w]/gi, '');
                    this[key] = property.render();
                }, val.properties);
            }
        }

        return val;
    }
}