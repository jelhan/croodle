import Ember from 'ember';

export default Ember.Test.registerHelper('t', function(app, key, context) {
  return app.__container__.lookup('service:i18n').t(key, context);
});
