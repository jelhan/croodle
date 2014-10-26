export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    save: function() {
      // redirect to CreateMeta
      this.transitionToRoute('create.meta');
    },
    
    submit: function(){
      this.validate();
      
      if (this.get('isValid')) {
        this.send('save');
      }
    }
  },

  pollTypes: function(){
    return [
      Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
        id : "FindADate",
        labelTranslation : "pollTypes.findADate.label"
      }),
      Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
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