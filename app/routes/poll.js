import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    error: function(error) {
      if (error && error.status === 404) {
        return this.transitionTo('404');
      }
      
      return true;
    }
  }
});