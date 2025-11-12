import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from '@croodle/client/tests/pages/defaults';
import { hasFocus } from '@croodle/client/tests/pages/helpers';

const { assign } = Object;

let { fillable } = PageObject;

export default PageObject.create(
  assign({}, defaultsForCreate, {
    description: fillable('.description textarea'),
    title: fillable('.title input'),
    titleHasFocus: hasFocus('.title input'),
  }),
);
