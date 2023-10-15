import {
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text,
} from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';
import { calendarSelect } from 'ember-power-calendar/test-support';
import { assign } from '@ember/polyfills';
import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { DateTime } from 'luxon';

function selectDates(selector) {
  return {
    isDescriptor: true,
    async value(dateOrDateTimes) {
      assert(
        'selectDates expects an array of date or DateTime (luxon) objects as frist argument',
        isArray(dateOrDateTimes) &&
          dateOrDateTimes.every(
            (dateOrDateTime) =>
              dateOrDateTime instanceof Date ||
              DateTime.isDateTime(dateOrDateTime)
          )
      );

      for (let i = 0; i < dateOrDateTimes.length; i++) {
        let dateOrDateTime = dateOrDateTimes[i];
        let date = DateTime.isDateTime(dateOrDateTime)
          ? dateOrDateTime.toJSDate()
          : dateOrDateTime;
        await calendarSelect(selector, date);
      }
    },
  };
}

export default create(
  assign({}, defaultsForCreate, {
    selectDates: selectDates('[data-test-form-element-for="days"]'),
    dateHasError: isVisible('.days.has-error'),
    dateError: text('.days .help-block'),

    textOptions: collection({
      itemScope: '.form-group.option',
      item: {
        add: clickable('button.add'),
        delete: clickable('button.delete'),
        hasError: hasClass('is-invalid', 'input'),
        title: fillable('input'),
      },
    }),
    firstTextOption: {
      scope: '.form-group.option:first',

      inputHasFocus: hasFocus('input'),
    },
  })
);
