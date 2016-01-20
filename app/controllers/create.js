import Ember from 'ember';
/* global jstz */

export default Ember.Controller.extend({
  /*
   * sets timezone property of model to users timezone if dates with
   * times are specified
   * otherwise we don't need to store timezone of user created the poll
   */
  setTimezone: function() {
    if(
      this.get('model.isFindADate') &&
      this.get('model.isDateTime')
    ) {
      this.set('model.timezone', jstz.determine().name());
    }
    else {
      this.set('model.timezone', '');
    }
  }.observes('model.isDateTime', 'model.isFindADate')
});
