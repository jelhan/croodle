export default Ember.View.extend({
  title: '',

  actions: {
    moreOptions: function(){
      console.log('runs');
        // create new Option
        this.get('controller.model.options').pushObject({title: ''});
   }
  }
});