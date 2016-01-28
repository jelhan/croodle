import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    saveRetry() {
      this.get('model.record').save().then(function() {
        // retry war erfolgreich
        Ember.$('.modal').modal('hide');
      });
    }
  }
});
