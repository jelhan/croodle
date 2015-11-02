import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('switchTab', function(app, tab) {
  click('.nav-tabs .' + tab + ' a');
});
