export default Ember.View.extend({
  title: '',

  actions: {
    moreOptions: function(){
        // create new Option
        this.get('controller.model.options').pushObject({title: ''});
   }
  }
});