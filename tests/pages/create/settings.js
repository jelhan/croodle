import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';

const {
  assign
} = Object;

const {
  fillable,
  visitable
} = PageObject;

export default PageObject.create(assign({}, defaultsForCreate, {
  availableAnswers: fillable('.answer-type select'),
  availableAnswersHasFocus: hasFocus('.answer-type select'),
  visit: visitable('/create/settings')
}));
