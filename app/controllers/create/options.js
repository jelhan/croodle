import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    nextPage: function(){
      this.transitionToRoute('create.settings');
    }
  }
});
