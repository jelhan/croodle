import Ember from "ember";

export default Ember.View.extend({
  actions: {
    moreOptions: function(){
      // create new Option
      this.get('controller.optionsTexts').pushObject({
        'value': ''
      });
   }
  }
});