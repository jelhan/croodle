export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    submit: function(){
      // redirect to CreateMeta
      this.transitionToRoute('create.meta');
    }
  },

  pollTypes: function(){
    return [
      Ember.Object.create({
        id : "FindADate",
        label : "Find a date"
      }),
      Ember.Object.create({
        id : "MakeAPoll",
        label : "Make a poll"
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