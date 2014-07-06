export default Ember.Route.extend({
  model: function(){
    return this.modelFor('create');
  },
  
  afterModel: function(create){
    // redirect to create/options if poll type is not FindADate or
    // if not atleast 2 options are defined or
    // if datetime is not true
    if (create.get('pollType') !== "FindADate" ||
        create.get('options.length') < 2 ||
        !create.get('isDateTime')) {
      this.transitionTo('create.options');
    }
  }
});