export default Ember.Route.extend({
  beforeModel: function(){
    // generate encryptionKey
    var encryptionKeyLength = 40;
    var encryptionKeyChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    var encryptionKey = '';
    var list = encryptionKeyChars.split('');
    var len = list.length, i = 0;
    do {
      i++;
      var index = Math.floor(Math.random() * len);
      encryptionKey += list[index];
    } while(i < encryptionKeyLength);
    
    // set encryption key
    this.set('encryption.key', encryptionKey);
  },

  model: function(){
    // create empty poll
    return this.store.createRecord('poll', {
      creationDate : new Date(),
      options : [{title: ''}, {title: ''}],
      forceAnswer: true,
      anonymousUser: false,
      datetime: false,
      datetimesInputFields: 2,
      timezoneOffset: new Date().getTimezoneOffset()
    });
  }
});
