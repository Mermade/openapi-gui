Vue.component('api-items', {
	props: ["parent", "child"],
    computed: {
        effectiveType : {
            get : function() {
                return this.child.type;
            },
            set : function(newVal) {
                this.child.type = newVal;
                if (newVal == 'array') {
                    var items = {};
                    items.type = 'string';
                    Vue.set(this.child, 'items', items);
                    Vue.set(this.child, 'collectionFormat', 'csv');
                }
                else {
                    Vue.delete(this.child, 'items');
                    Vue.delete(this.child, 'collectionFormat');
                    Vue.delete(this.child, 'uniqueItems');
                    Vue.delete(this.child, 'minItems');
                    Vue.delete(this.child, 'maxItems');
                }
            }
        }
    },
	data: function() {
		return {}
	},
    template: '#template-items'
});
