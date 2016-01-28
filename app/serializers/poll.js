import DS from 'ember-data';
import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    users: {
      deserialize: 'records'
    }
  },

  legacySupport(resourceHash) {
    // croodle <= 0.3.0
    // property 'type' of answers was named 'id'
    if (
      resourceHash.answers.length > 0 &&
      !Ember.isEmpty(resourceHash.answers[0].id)
    ) {
      resourceHash.answers.forEach((answer, index) => {
        resourceHash.answers[index].type = answer.id;
        delete resourceHash.answers[index].id;
      });
    }

    return resourceHash;
  }
});
