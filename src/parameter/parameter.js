function Parameter (name) {
	
	this.availableFormatsFor = function(type) {
	  if (type === 'string') return ['','date','date-time'];
      if (type === 'integer') return ['','int32','int64'];
      return [''];
    }

    this.id = generateId();
    this.in = 'query';
    this.name = name;
    this.description = '';
    this.required = 'false';
    this.default ='';
    this.type = 'string';
	this.format = '';
	this.pattern = '';
	this.availableFormats = this.availableFormatsFor(this.type);
    this.properties = [];

    this.load = function(parameterDefinition) {
        this.description = parameterDefinition.description;
        this.required = parameterDefinition.required ? 'true' : 'false';
        this.default = parameterDefinition.default;
        this.type = parameterDefinition.type;
		this.availableFormats = this.availableFormatsFor(this.type);
		this.format = parameterDefinition.format;
		this.pattern = parameterDefinition.pattern;
        this.in = parameterDefinition.in;
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
            name: this.name,
            description: this.description,
            required: this.required == "true",
            default: this.default,
            type: this.type,
			format: this.format,
			pattern: this.pattern,
            in: this.in
        };

		if (!val.description) delete val.description;
		if (!val.default) delete val.default;
		if (!val.format) delete val.format;
		if (!val.pattern) delete val.pattern;

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
