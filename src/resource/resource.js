Vue.component('api-resource', {
	props: ['path', 'index', 'maintags'],
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
        },
        httpMethods : function() {
            var result = {};
            for (var m in this.methods) {
                if (this.path[this.methods[m]]) {
                    result[this.methods[m]] = this.path[this.methods[m]];
                }
            }
            return result;
        }
    },
	data: function() {
		return {
            methods : ['get','post','put','delete','patch','head','options']
        }
	},
    methods : {
		removePath : function(target) {
            this.$parent.removePath(target);
	    },
        addOperation : function(template) {
            var index = 0;
            while (this.path[this.methods[index]] && index<this.methods.length) {
                index++;
            }
            if (index<this.methods.length) {
                var responses = {};
                responses["200"] = {
                    description: "default"
                };
                var op = {};
                op.summary = template && template.summary || '';
                op.description = template && template.description || '';
                op.parameters = template && template.parameters || [];
                op.operationId = template && template.operationId || '';
                op.responses = template && template.responses || responses;
                Vue.set(this.path, this.methods[index], op);
            }
        },
        removeOperation : function(target) {
            this.$root.save();
            Vue.delete(this.path, target);
        },
        renameOperation : function(oldMethod, newMethod) {
            if (this.path[newMethod]) {
                Vue.set(this.path, 'x-temp', this.path[newMethod]);
                Vue.delete(this.path, newMethod);
            }
            Vue.set(this.path, newMethod, this.path[oldMethod]);
            Vue.delete(this.path, oldMethod);
            if (this.path.temp) {
                Vue.set(this.path, oldMethod, this.path.temp);
                Vue.delete(this.path, 'x-temp');
            }
        }
    },
	template: '#template-resource'
});
