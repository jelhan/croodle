import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
  actions: {
    save: function() {
      // redirect to CreateOptions
      this.transitionToRoute('create.options');
    },
    
    submit: function(){
      this.validate();
      
      Ember.$.each(Ember.View.views, function(id, view) {
        if(view.isEasyForm) {
          view.focusOut();
        }
      });
      
      if (this.get('isValid')) {
        this.send('save');
      }
    }
  },
           
  validations: {
    title: {
      presence: true,
      length: {
        minimum: 2
      }
    }
  }
});