export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  needs: 'create',
  
  optionsDates: Ember.computed.alias("controllers.create.optionsDates"),
  optionsTexts: Ember.computed.alias("controllers.create.optionsTexts"),
    
  actions: {
    save: function(){
      if (this.get('isDateTime')) {
        this.transitionToRoute('create.options-datetime');
      }
      else {
        this.transitionToRoute('create.settings'); 
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
    var requiredOptionsLength,
        givenOptions,
        filtedOptions;

    if (this.get('isFindADate')) {
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
    if (this.get('isDateTime')) {
      // only one date is required if times will be set
      requiredOptionsLength = 1;
    }
    else {
      // if it's a poll or if dates without times are inserted we require atleast
      // two options
      requiredOptionsLength = 2;
    }
    
    // array of options which have no title
    filtedOptions = givenOptions.filterBy('title', '');
    
    return (givenOptions.length - filtedOptions.length) >= requiredOptionsLength;
  }.property('options.@each.title', 'isDateTime'),

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