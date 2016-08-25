import PageObject from 'ember-cli-page-object';
import { defaultsForApplication } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';

let {
  collection,
  fillable,
  text,
  visitable
} = PageObject;

const { assign } = Object;

const urlMatches = function(regExp) {
  return function() {
    const pollURL = currentURL();
    return regExp.test(pollURL);
  };
};

export default PageObject.create(assign({}, defaultsForApplication, {
  description: text('.description'),
  name: fillable('.name input'),
  nameHasFocus: hasFocus('.name input'),
  options: collection({
    answers: text('.selections .form-group:eq(0) .radio', { multiple: true }),
    itemScope: '.selections .form-group',
    item: {
      label: text('label.control-label')
    },
    labels: text('.selections .form-group label.control-label', { multiple: true })
  }),
  title: text('h2.title'),
  urlIsValid: urlMatches(/^\/poll\/[a-zA-Z0-9]{10}\/participation\?encryptionKey=[a-zA-Z0-9]{40}$/),
  // use as .visit({ encryptionKey: ??? })
  visit: visitable('/poll/participation')
}));
