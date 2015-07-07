import Ember from "ember";

export default Ember.Route.extend({
  model: function(){
    return this.modelFor('create');
  },

  // redirect to create/meta if title is not set
  afterModel: function(create){
    if (create.get('title') === null) {
      this.transitionTo('create.meta');
    }
  }
});
