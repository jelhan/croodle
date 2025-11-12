import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from '@croodle/client/tests/pages/defaults';
import { hasFocus } from '@croodle/client/tests/pages/helpers';

const { assign } = Object;

let { clickable, collection, fillable, hasClass, text } = PageObject;

export default PageObject.create(
  assign({}, defaultsForCreate, {
    times: collection('.form-group', {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      label: text('label'),
      labelIsHidden: hasClass('label', 'sr-only'),
      time: fillable('input'),
    }),
    firstTime: {
      scope: '.form-group:first',

      inputHasFocus: hasFocus('input'),
    },
  }),
);
