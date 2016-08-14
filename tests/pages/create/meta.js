import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';

const {
  assign
} = Object;

let {
  clickable,
  fillable
} = PageObject;

export default PageObject.create(assign(defaultsForCreate, {
  description: fillable('.description textarea'),
  next: clickable('button[type="submit"]'),
  title: fillable('.title input')
}));
