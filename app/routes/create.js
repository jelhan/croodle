import Ember from "ember";
import generatePassphrase from "../utils/generate-passphrase";

export default Ember.Route.extend({
  beforeModel: function(){
    // set encryption key
    var passphraseLength = 40;
    this.set('encryption.key', generatePassphrase( passphraseLength ));
  },

  events: {
    transitionToPoll: function(poll){
      this.transitionTo('poll', poll, {queryParams: {encryptionKey: this.get('encryption.key')}});
    }
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
      isDateTime: false,
      timezoneOffset: new Date().getTimezoneOffset(),
      version: this.buildInfo.version + '-' + this.buildInfo.commit
    });
  }
});
