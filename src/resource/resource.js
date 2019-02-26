Vue.component('api-resource', {
	props: ['openapi', 'path', 'index', 'maintags'],
    computed: {
        pathEntry : {
            get : function() {
                 return this.index
            },
            set : function(newVal) {
                Vue.set(this.openapi.paths, newVal, this.openapi.paths[this.index]);
                Vue.delete(this.openapi.paths, this.index);
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
            methods : ['get','post','put','delete','patch','head','options','trace']
        }
	},
    methods : {
        sanitisePath : function() {
            return 'resource_'+this.index.split('/').join('').split('{').join('').split('}').join('');
        },
        addResource : function () {
            this.$parent.addResource();
        },
        duplicateResource : function (index) {
            if (!this.openapi.paths['newPath']) {
                Vue.set(this.openapi.paths,'/newPath',clone(this.openapi.paths[index]));
            }
        },
		removePath: function (target) {
			this.$root.save();
			Vue.delete(this.openapi.paths, target);
		},
        editPathDesc: function() {
            $('#pathDesc'+this.sanitisePath()).toggleClass('hidden');
        },
        hidePathDesc: function() {
            $('#pathDesc'+this.sanitisePath()).addClass('hidden');
        },
        addOperation : function(template) {
            var index = 0;
            while (this.path[this.methods[index]] && index<this.methods.length) {
                index++;
            }
            if (index<this.methods.length) {
                var responses = {};
                responses.default = {
                    description: "Default response"
                };
                var op = {};
                op.summary = template && template.summary || '';
                op.description = template && template.description || '';
                op.externalDocs = template && template.externalDocs || {};
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
