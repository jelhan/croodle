import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';

const {
  assign
} = Object;

const {
  visitable
} = PageObject;

export default PageObject.create(assign({}, defaultsForCreate, {
  visit: visitable('/create/settings')
}));
