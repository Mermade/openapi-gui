Vue.component('api-method', {
	props: ['key', 'method', 'index'],
	data: function() {
		return {}
	},
    methods: {
        toggleBodyDisplay : function(el) {
            el.collapse('toggle');
        },
        duplicateOperation : function(method) {
            this.$parent.addMethod(method);
        },
		removeOperation : function(target) {
            this.$parent.removeOperation(target);
	    },
        addParameter : function() {
            var newParam = {};
            newParam.name = 'newParam';
            newParam.in = 'query';
            newParam.required = 'true';
            newParam.type = 'string';
            this.method.parameters.push(newParam);
        },
        removeParameter : function(index) {
            this.method.parameters.splice(index,1);
        }
    },
    computed: {
        httpMethod : function() {
            return this.index.toUpperCase();
        },
        hashUid : function() {
            return '#'+this._uid;
        }
    },
	template: '#template-method'
});

/*
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
			  var ptr = parameterDefinition["$ref"].substr(1);
			  try {
			    parameterDefinition = new JSONPointer(ptr).get(openApi);
			  }
			  catch (ex) {
			    bootbox.alert('Could not find $ref: '+parameterDefinition["$ref"]);
			  }
			}
            parameter = new Parameter(parameterDefinition.name);
            parameter.load(parameterDefinition);
            this.push(parameter);
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
*/