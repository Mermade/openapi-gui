Vue.component('api-resource', {
	props: ['key', 'path', 'index'],
    computed: {
        sanitisePath : function() {
            return 'resource_'+this.index.split('/').join('').split('{').join('').split('}').join('');
        },
        pathEntry : {
            get : function() {
                 return this.index
            },
            set : function(newVal) {
                this.$parent.renamePath(this.index, newVal);
            }
        }
    },
	data: function() {
		return {}
	},
    methods : {
		removePath : function(target) {
            this.$parent.removePath(target);
	    },
        removeOperation : function(target) {
            this.$root.save();
            Vue.delete(this.path, target);
        },
        addMethod : function(template) {
            var methods = ['get','post','put','delete','head','patch','options'];
            var index = 0;
            while (this.path[methods[index]] && index<methods.length) {
                index++;
            }
            if (index<methods.length) {
                var method = {};
                method.summary = template.summary || '';
                method.description = template.description || '';
                method.parameters = template.parameters || [];
                method.operationId = template.operationId || '';
                Vue.set(this.path, methods[index], method);
            }
        }
    },
	template: '#template-resource'
});
