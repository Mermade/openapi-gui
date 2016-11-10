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
            this.$root.save();
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
