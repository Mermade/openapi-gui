Vue.component('api-property', {
  name:'api-property',
  props:['schema','type','format','property','title','summary','description',
    'isarray','linkId'],
  inject:['formData'],
  template: '#template-property',
  methods: {
	markdownPreview: function(id,text) {
      this.$root.markdownPreview(id,text);
	},
  }
});

Vue.component('api-extension', {
  props:['semoasa','attach'],
  template: '#template-extension',
  data(){
    return {
        formData:{}
    }
  },
  provide(){
    return {formData:this.formData}
  }
});

