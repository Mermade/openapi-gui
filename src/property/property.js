function Property (title) {
    this.id = generateId()
    this.title = title;
    this.description = '';
    this.required = 'false';
    this.default ='';
    this.type = 'string';
    this.properties = [];

    this.load = function(propertyDefinition) {
        this.description = propertyDefinition.description;
        this.required = propertyDefinition.required ? 'true' : 'false';
        this.default = propertyDefinition.default;
        this.type = propertyDefinition.type;
        this.properties = [];

        if ( this.type === 'array' && propertyDefinition.items !== undefined ) {
            groupingProperty = new Property( propertyDefinition.items.title )
            groupingProperty.description = propertyDefinition.items.description;
            groupingProperty.required = propertyDefinition.items.required;
            groupingProperty.default = propertyDefinition.items.default;
            groupingProperty.type = propertyDefinition.items.type;
            groupingProperty.properties = propertyDefinition.items.properties;
            var properties = [groupingProperty];
        }
        else {
            var properties = propertyDefinition.properties;
        }

        angular.forEach(properties, function(propertyDefinition) {
            var property = new Property(propertyDefinition.title);
            property.load(propertyDefinition);
            this.push( property );
        }, this.properties);
    }

    this.render = function() {

        var properties = {};

        angular.forEach(this.properties, function(property) {
            var key = property.title.replace(/[^\w]/gi, '');
            this[key] = property.render();
        }, properties);
            
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
                // only item TODO remove
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
