import { isPresent } from '@ember/utils';
import PageObject from 'ember-cli-page-object';
import { findElementWithAssert } from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';
import { hasFocus } from 'croodle/tests/pages/helpers';

const {
  assign
} = Object;

let {
  clickable,
  collection,
  fillable,
  hasClass,
  isVisible,
  text
} = PageObject;

const setBootstrapDatepicker = function(selector, options = {}) {
  return {
    isDescriptor: true,
    value(dates) {
      const el = findElementWithAssert(this, selector, options);
      if (isPresent(dates)) {
        const normalizedDates = dates.map((date) => {
          if (typeof date.toDate === 'function') {
            date = date.toDate();
          }
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          return date;
        });
        el.datepicker('setDates', normalizedDates);
      }
      return el.datepicker('getDates');
    }
  };
};

export default PageObject.create(assign({}, defaultsForCreate, {
  dateOptions: setBootstrapDatepicker('.days .ember-view:has(.datepicker:first-child)'),
  dateHasError: isVisible('.days.has-error'),
  dateError: text('.days .help-block'),
  textOptions: collection({
    itemScope: '.form-group.option',
    item: {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      hasError: hasClass('has-error'),
      title: fillable('input')
    }
  }),
  firstTextOption: {
    scope: '.form-group.option:first',

    inputHasFocus: hasFocus('input')
  }
}));
