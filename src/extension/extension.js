Vue.component('api-property', {
  name:'api-property',
  props:['schema','type','format','property','title','linkId'],
  inject:['formData'],
  template: '#template-property'
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

