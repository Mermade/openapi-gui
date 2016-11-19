Vue.component('api-method', {
	props: ['key', 'method', 'index', 'maintags'],
	data: function() {
		return {
            visible: false
        }
	},
    methods: {
        toggleBody : function() {
            this.visible = !this.visible;
            $(this.hashUid).collapse('toggle');
            if (this.visible) {
                Vue.nextTick(function(){
                    this.tagSetup();
                },this);
            }
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
        },
        tagSetup : function() {
            var simpleTags = [];
            for (var t in this.maintags) {
                simpleTags.push(this.maintags[t].name);
            }
            $(this.hashTagId).tagsinput({
                typeahead: {
                    name: this.tagId,
                    source: function(query) {
                        return simpleTags;
                    }
                }
            });
            for (var t in this.method.tags) {
                $(this.hashTagId).tagsinput('add', this.method.tags[t]);
            }
            $(this.hashTagId).on('itemAdded', function(event) {
                // event.item: contains the item. Convert jQuery event to native event for vue.js
                var e = document.createEvent('HTMLEvents');
                e.initEvent('change', true, true);
                setTimeout(function(){
                    this.dispatchEvent(e);
                },0);
            });
            $(this.hashTagId).on('itemRemoved', function(event) {
                // event.item: contains the item. Convert jQuery event to native event for vue.js
                var e = document.createEvent('HTMLEvents');
                e.initEvent('change', true, true);
                setTimeout(function(){
                    this.dispatchEvent(e);
                },0);
            });
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
        tagId : function() {
            return 'tags-input'+this._uid;
        },
        hashTagId : function() {
            return '#'+this.tagId;
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
        //this.tagSetup();
    },
	template: '#template-method'
});
