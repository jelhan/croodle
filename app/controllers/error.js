export default Ember.ObjectController.extend({
	is404: function(){
		return this.get('status') === 404;
	}.property('status')
});