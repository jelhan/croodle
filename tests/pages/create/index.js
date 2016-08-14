import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';

const {
  assign
} = Object;

const {
  clickable,
  fillable,
  visitable
} = PageObject;

export default PageObject.create(assign(defaultsForCreate, {
  next: clickable('button[type="submit"]'),
  pollType: fillable('.poll-type select'),
  visit: visitable('/create')
}));
