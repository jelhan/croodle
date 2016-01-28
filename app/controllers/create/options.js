import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    nextPage() {
      this.transitionToRoute('create.settings');
    }
  }
});
