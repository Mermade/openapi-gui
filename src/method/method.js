Vue.component('api-method', {
	props: ['key', 'method', 'index', 'maintags'],
	data: function() {
		return {}
	},
    methods: {
        toggleBodyDisplay : function(el) {
            el.collapse('toggle');
        },
        duplicateOperation : function(method) {
            this.$parent.addOperation(method);
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
        httpMethod : {
            get : function() {
                return this.index.toUpperCase();
            },
            set : function(newVal) {
                this.$parent.renameOperation(this.index, newVal.toLowerCase());
            }
        },
        hashUid : function() {
            return '#'+this._uid;
        },
        vtags : {
            get : function() {
                return this.method.tags;
            },
            set : function(newVal) {
                this.method.tags = newVal;
            }
        }
    },
    beforeMount : function() {
        if (!this.method.externalDocs) {
            Vue.set(this.method, 'externalDocs', {});
        }
    },
    mounted : function() {
        $('.input-tag').tagsinput();
        $('.input-tag').on('itemAdded', function(event) {
            // event.item: contains the item. Convert jQuery event to native event for vue.js
            var e = document.createEvent('HTMLEvents');
            e.initEvent('change', true, true);
            this.dispatchEvent(e);
        });
        $('.input-tag').on('itemRemoved', function(event) {
            // event.item: contains the item. Convert jQuery event to native event for vue.js
            var e = document.createEvent('HTMLEvents');
            e.initEvent('change', true, true);
            this.dispatchEvent(e);
        });
    },
	template: '#template-method'
});
