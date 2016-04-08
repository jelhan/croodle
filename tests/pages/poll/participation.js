import PageObject from 'croodle/tests/page-object';

let {
  collection,
  text,
  visitable
} = PageObject;

const urlMatches = function(regExp) {
  return function() {
    const pollURL = currentURL();
    return regExp.test(pollURL);
  };
};

export default PageObject.create({
  description: text('.description'),
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
});
