import {
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text
} from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';
import { calendarSelect } from 'ember-power-calendar/test-support';
import { assign } from '@ember/polyfills';
import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import moment from 'moment';

function selectDates(selector) {
  return {
    isDescriptor: true,
    async value(dateOrMoments) {
      assert(
        'selectDates expects an array of date or moment objects as frist argument',
        isArray(dateOrMoments) && dateOrMoments.every((dateOrMoment) => dateOrMoment instanceof Date || moment.isMoment(dateOrMoment))
      )

      for (let i = 0; i < dateOrMoments.length; i++) {
        let dateOrMoment = dateOrMoments[i];
        let date = moment.isMoment(dateOrMoment) ? dateOrMoment.toDate() : dateOrMoment;
        await calendarSelect(selector, date);
      }
    }
  };
}

export default create(assign({}, defaultsForCreate, {
  selectDates: selectDates('[data-test-form-element-for="days"]'),
  dateHasError: isVisible('.days.has-error'),
  dateError: text('.days .help-block'),

  textOptions: collection({
    itemScope: '.form-group.option',
    item: {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      hasError: hasClass('is-invalid', 'input'),
      title: fillable('input')
    }
  }),
  firstTextOption: {
    scope: '.form-group.option:first',

    inputHasFocus: hasFocus('input')
  }
}));
