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

        angular.forEach(propertyDefinition.properties, function(propertyDefinition) {
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
                val.items = {};
                val.items.type = this.arrayType;
                val.items.properties = properties;
            }
            else {
                val.properties = properties;
            }
        }

        return val;
    }
}