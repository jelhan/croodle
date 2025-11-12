import PageObject from 'ember-cli-page-object';
import { definition as Poll } from '@croodle/client/tests/pages/poll';
import { defaultsForApplication } from '@croodle/client/tests/pages/defaults';
import { hasFocus } from '@croodle/client/tests/pages/helpers';

let { collection, fillable, text, visitable } = PageObject;

const { assign } = Object;

export default PageObject.create(
  assign({}, defaultsForApplication, Poll, {
    description: text('.description'),
    name: fillable('.name input'),
    nameHasFocus: hasFocus('.name input'),
    options: collection('.selections .form-group', {
      label: text('label'),
    }),
    title: text('h2.title'),
    // use as .visit({ encryptionKey: ??? })
    visit: visitable('/poll/participation'),
  }),
);
