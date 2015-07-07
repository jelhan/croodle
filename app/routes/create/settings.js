import Ember from "ember";

export default Ember.Route.extend({
  model: function(){
    return this.modelFor('create');
  },

  // redirect to create/options if not enough options are defined
  afterModel: function(create){
    var self = this;
    
    // check if only default options are defined
    if (create.get('options.length') === 2) {
      create.get('options').forEach(function(option) {
        if (option.title === '') {
          self.transitionTo('create.options');
        }
      });
    }
    // check if less then two options are defined
    else if (create.get('options.length') < 2) {
      this.transitionTo('create.options');
    }
  }
});
