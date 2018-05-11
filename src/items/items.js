Vue.component('api-items', {
	props: ["parent", "child", "level"],
    computed: {
        formatListId : function() {
            return 'listFormats'+this._uid;
        },
        effectiveType : {
            get : function() {
                return this.child.type;
            },
            set : function(newVal) {
                this.child.type = newVal;
                if (newVal == 'array') {
                    // TODO replicate parameter array switching logic
                    var items = {};
                    items.type = 'string';
                    Vue.set(this.child, 'items', items);
                }
                else {
                    Vue.delete(this.child, 'items');
                    Vue.delete(this.child, 'uniqueItems');
                    Vue.delete(this.child, 'minItems');
                    Vue.delete(this.child, 'maxItems');
                }
            }
        },
        effectiveFormats : {
            get : function() {
                if (this.child.type == 'integer') return ['int32','int64'];
                if (this.child.type == 'number') return ['float','double'];
                if (this.child.type == 'string') return ['date','date-time','byte','binary','password'];
                return [];
            },
            set : function(newVal) {}
        },
        levelPlusOne : function() {
            return (this.level+1);
        }
    },
    methods: {
        addEnum : function() {
            if (!this.child.enum) {
                Vue.set(this.child, 'enum', []);
            }
            this.child.enum.push('newValue');
        },
        removeEnum : function(index) {
            this.child.enum.splice(index, 1);
        }
    },
	data: function() {
		return {}
	},
    template: '#template-items'
});
