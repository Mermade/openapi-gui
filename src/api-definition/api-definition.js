Vue.component('api-definition', {
	props: ['openapi'],
	data: function() {
		return {}
	},
	template: '#template-definition',
	methods: {
		uploadSchema: function ($event) {
			this.$parent.uploadSchema($event);
		}
	}
});
