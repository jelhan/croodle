import Ember from "ember";

export default Ember.View.extend({
  show: function() {
    var self = this;
    
    this.$('.modal').modal();
    
    this.$('.modal').on('hidden.bs.modal', function() {
      self.get('controller').send('removeModal');
    });
  }.on('didInsertElement')
});