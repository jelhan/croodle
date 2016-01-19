import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    nextPage: function(){
      if (this.get('model.isDateTime')) {
        this.transitionToRoute('create.options-datetime');
      }
      else {
        this.transitionToRoute('create.settings');
      }
    }
  }
});
