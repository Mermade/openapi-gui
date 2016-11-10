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
        addOperation : function(template) {
            var methods = ['get','post','put','delete','head','patch','options'];
            var index = 0;
            while (this.path[methods[index]] && index<methods.length) {
                index++;
            }
            if (index<methods.length) {
                var op = {};
                op.summary = template.summary || '';
                op.description = template.description || '';
                op.parameters = template.parameters || [];
                op.operationId = template.operationId || '';
                Vue.set(this.path, methods[index], op);
            }
        },
        removeOperation : function(target) {
            this.$root.save();
            Vue.delete(this.path, target);
        },
        renameOperation : function(oldMethod, newMethod) {
            if (this.path[newMethod]) {
                Vue.set(this.path, 'temp', this.path[newMethod]);
                Vue.delete(this.path, newMethod);
            }
            Vue.set(this.path, newMethod, this.path[oldMethod]);
            Vue.delete(this.path, oldMethod);
            if (this.path.temp) {
                Vue.set(this.path, oldMethod, this.path.temp);
                Vue.delete(this.path, 'temp');
            }
        }
    },
	template: '#template-resource'
});
