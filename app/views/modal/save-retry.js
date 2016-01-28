import Ember from 'ember';

export default Ember.View.extend({
  show: function() {
    this.$('.modal').modal();

    this.$('.modal').on('hidden.bs.modal', () => {
      this.get('controller').send('removeModal');
    });
  }.on('didInsertElement')
});
