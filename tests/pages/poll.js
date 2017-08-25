import {
  clickable,
  create,
  isVisible,
  text
} from 'ember-cli-page-object';

const urlMatches = function(regExp) {
  return function() {
    return regExp.test(currentURL());
  };
};

export const definition = {
  copyUrl: clickable('.poll-link .copy-btn'),
  showsExpirationWarning: isVisible('.expiration-warning'),
  url: text('.poll-link .link a'),
  urlIsValid: urlMatches(/^\/poll\/[a-zA-Z0-9]{10}\/participation\?encryptionKey=[a-zA-Z0-9]{40}$/)
};

export default create(definition);
