import {
  create,
  isVisible,
  text
} from 'ember-cli-page-object';
import { currentURL } from '@ember/test-helpers';

const urlMatches = function(regExp) {
  return function() {
    return regExp.test(currentURL());
  };
};

export const definition = {
  showsExpirationWarning: isVisible('.expiration-warning'),
  url: text('.poll-link .link code'),
  urlIsValid: urlMatches(/^\/poll\/[a-zA-Z0-9]{10}\/participation\?encryptionKey=[a-zA-Z0-9]{40}$/)
};

export default create(definition);
