export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    save: function() {
      // redirect to CreateOptions
      this.transitionToRoute('create.options');
    },
    
    submit: function(){
      this.validate();
      
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