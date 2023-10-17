import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';

const { assign } = Object;

const { fillable, visitable } = PageObject;

export default PageObject.create(
  assign({}, defaultsForCreate, {
    pollType: fillable('.poll-type select'),
    pollTypeHasFocus: hasFocus('.poll-type select'),
    visit: visitable('/create'),
  }),
);
