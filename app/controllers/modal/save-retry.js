import Ember from 'ember';

const { $, ObjectController } = Ember;

export default ObjectController.extend({
  actions: {
    saveRetry() {
      this.get('model.record').save().then(function() {
        // retry war erfolgreich
        $('.modal').modal('hide');
      });
    }
  }
});
