import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';

const {
  assign
} = Object;

const {
  fillable,
  visitable
} = PageObject;

export default PageObject.create(assign(defaultsForCreate, {
  pollType: fillable('.poll-type select'),
  visit: visitable('/create')
}));
