import EncryptionStorage from 'croodle/models/encryption';

export default {
  name: "injectEncryptionKey",
  after: "store",

  initialize: function(container, application) {
    container.register('encryption:current', EncryptionStorage, {singleton: true});
    application.inject('controller:poll', 'encryption', 'encryption:current');
    application.inject('adapter', 'encryption', 'encryption:current');
    application.inject('route:create', 'encryption', 'encryption:current');
    application.inject('route:poll', 'encryption', 'encryption:current');
    application.inject('model', 'encryption', 'encryption:current');
  }
};
