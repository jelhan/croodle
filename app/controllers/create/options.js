import Ember from "ember";
import EmberValidations from "ember-validations";

export default Ember.Controller.extend(EmberValidations.Mixin, {
  needs: 'create',
  
  optionsDates: Ember.computed.alias("controllers.create.optionsDates"),
  optionsTexts: Ember.computed.alias("controllers.create.optionsTexts"),
    
  actions: {
    save: function(){
      if (this.get('model.isDateTime')) {
        this.transitionToRoute('create.options-datetime');
      }
      else {
        this.transitionToRoute('create.settings'); 
      }
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

  /*
   * returns true if required number of options is reached
   */
  enoughOptions: function(){
    var requiredOptionsLength,
        givenOptions,
        filtedOptions;

    if (this.get('model.isFindADate')) {
      givenOptions = this.get('optionsDates');
    }
    else {
      givenOptions = this.get('optionsTexts');
    }

    // check if options are defined
    if (typeof givenOptions === 'undefined') {
      return false;
    }
    
    // set requiredOptions
    if (this.get('model.isDateTime')) {
      // only one date is required if times will be set
      requiredOptionsLength = 1;
    }
    else {
      // if it's a poll or if dates without times are inserted we require atleast
      // two options
      requiredOptionsLength = 2;
    }
    
    // array of options which have no title
    filtedOptions = givenOptions.filterBy('value', '');
    
    return (givenOptions.length - filtedOptions.length) >= requiredOptionsLength;
  }.property('model.options.@each.title', 'model.isDateTime'),

  /*
   * maps optionsDates for bootstrap datepicker as a simple array of date objects
   */
  optionsBootstrapDatepicker: Ember.computed('optionsDates', {
    get: function() {
      return this.get('optionsDates').map(function(item){
        return item.title;
      });
    },    
    set: function(key, value) {
      var newOptionsDates = [];
      if(Ember.isArray(value) && value.length > 0) {
        newOptionsDates = value.map(function(item) {
          return { title: item };
        });
      }
      this.set('optionsDates', newOptionsDates);

      return value;
    },
  }),

  validations: {
    enoughOptions: {
      acceptance: {
        message: Ember.I18n.t('create.options.error.notEnoughDates'),
        if: 'model.isFindADate'
      },
      inclusion: {
        in: ['1', 1, true],
        message: Ember.I18n.t('create.options.error.notEnoughOptions'),
        unless: 'model.isFindADate'
      }
    }
  }
});
