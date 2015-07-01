import Ember from "ember";

export default Ember.Controller.extend({
	is404: function(){
		return this.get('status') === 404;
	}.property('status')
});
