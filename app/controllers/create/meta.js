import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
  actions: {
    save: function() {
      // redirect to CreateOptions
      this.transitionToRoute('create.options');
    },
    
    submit: function(){
      var self = this;
      this.validate().then(function() {
        self.send('save');
      }).catch(function(){
        Ember.$.each(Ember.View.views, function(id, view) {
          if(view.isEasyForm) {
            view.focusOut();
          }
        });
      });
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
