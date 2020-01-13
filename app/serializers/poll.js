import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import { isEmpty } from '@ember/utils';
import ApplicationSerializer from './application';

export default class PollSerializer extends ApplicationSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    users: {
      deserialize: 'records'
    }
  };

  legacySupport(resourceHash) {
    // croodle <= 0.3.0
    // property 'type' of answers was named 'id'
    if (
      resourceHash.answers.length > 0 &&
      !isEmpty(resourceHash.answers[0].id)
    ) {
      resourceHash.answers.forEach((answer, index) => {
        resourceHash.answers[index].type = answer.id;
        delete resourceHash.answers[index].id;
      });
    }

    return resourceHash;
  }
}
