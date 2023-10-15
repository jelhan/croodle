import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';

const { assign } = Object;

let { fillable } = PageObject;

export default PageObject.create(
  assign({}, defaultsForCreate, {
    description: fillable('.description textarea'),
    title: fillable('.title input'),
    titleHasFocus: hasFocus('.title input'),
  })
);
