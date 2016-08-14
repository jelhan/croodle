import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';

const {
  assign
} = Object;

let {
  clickable
} = PageObject;

export default PageObject.create(assign(defaultsForCreate, {
  next: clickable('button[type="submit"]')
}));
