import Ember from "ember";
import $ from "jquery";

export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    save: function(){
      var pollType = this.get('pollType');
      
      if (pollType === 'MakeAPoll') {
        var options = this.get('model.options'),
          newOptions = [];

        // remove options without value
        options.forEach(function(option) {
          if (option.title !== '') {
            newOptions.pushObject(option);
          }
        });

        // set updated options
        // 
        // we have to hardly set new options even if they wasn't changed to
        // trigger computed property; push on array doesn't trigger computed
        // property to recalculate
        this.set('model.options', newOptions);
        
        this.transitionToRoute('create.settings');
      }
      else {
        if (this.get('isDateTime')) {
          this.transitionToRoute('create.options-datetime');
        }
        else {
          this.transitionToRoute('create.settings'); 
        }
      }
    },
    
    submit: function() {
      this.validate();
      
      $.each(Ember.View.views, function(id, view) {
        if(view.isEasyForm) {
          view.focusOut();
        }
      });
      
      if (this.get('isValid')) {
        // tricker save action
        this.send('save');
      }
    }
  },

  /*
   * returns true if required number of options is reached
   */
  enoughOptions: function(){
    var requiredOptionsLength = 2,
        givenOptions,
        filtedOptions;

    givenOptions = this.get('options');

    // check if options are defined
    if (typeof givenOptions === 'undefined') {
      return false;
    }

    // reduce array to options which have a title
    filtedOptions = givenOptions.filterBy('title', '');

    return (givenOptions.length - filtedOptions.length) >= requiredOptionsLength;
  }.property('options.@each.title'),

  validations: {
    enoughOptions: {
      acceptance: {
        message: Ember.I18n.t('create.options.error.notEnoughDates'),
        if: 'isFindADate'
      },
      inclusion: {
        in: ['1', 1, true],
        message: Ember.I18n.t('create.options.error.notEnoughOptions'),
        unless: 'isFindADate'
      }
    }
  }
});