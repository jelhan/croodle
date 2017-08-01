import PageObject from 'ember-cli-page-object';
import { defaultsForApplication } from 'croodle/tests/pages/defaults';

const { assign } = Object;
const {
  text
} = PageObject;

export default PageObject.create(assign({}, defaultsForApplication, {
  preferedOptions: text('.best-options .best-option-value', { multiple: true })
}));
