import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
  actions: {
    save: function() {
      // redirect to CreateMeta
      this.transitionToRoute('create.meta');
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

  pollTypes: function(){
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id : "FindADate",
        labelTranslation : "pollTypes.findADate.label"
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id : "MakeAPoll",
        labelTranslation : "pollTypes.makeAPoll.label"
      })
    ];
  }.property(),
  
  validations: {
    pollType: {
      presence: true,
      inclusion: {
        in: ['FindADate', 'MakeAPoll']
      }
    }
  }
});