import PageObject from 'ember-cli-page-object';
import { definition as Poll } from 'croodle/tests/pages/poll';
import { defaultsForApplication } from 'croodle/tests/pages/defaults';

const { assign } = Object;
const {
  text
} = PageObject;

export default PageObject.create(assign({}, defaultsForApplication, Poll, {
  preferedOptions: text('.best-options .best-option-value', { multiple: true })
}));
