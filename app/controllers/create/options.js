export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    /*
     * handles submit of option input for poll of type MakeAPoll
     */
    submitMakeAPoll: function() {
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

      // tricker save action
      this.send('save');
    },

    /*
     * handles submit of selected dates for poll of type MakeAPoll
     */
    submitFindADate: function() {
      // tricker save action
      this.send('save');
    },

    save: function(){
      // redirect to crate/options-datetime route if datetime is true
      // otherwise redirect directly to create/settings
      if (this.get('isDateTime')) {
        this.transitionToRoute('create.options-datetime');
      }
      else {
        this.transitionToRoute('create.settings'); 
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

  /*
   * invokes isValid state
   * used to enable / disabled next button
   */
  isNotValid: function(){
    return !this.get('isValid');
  }.property('isValid'),

  validations: {
    enoughOptions: {
      acceptance: true
    }
  }
});