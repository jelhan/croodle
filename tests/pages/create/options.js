import Ember from 'ember';
import PageObject from 'croodle/tests/page-object';
import { findElementWithAssert } from 'croodle/tests/page-object/helpers';

let {
  clickable,
  collection,
  fillable
} = PageObject;

const setBootstrapDatepicker = function(selector, options = {}) {
  return {
    isDescriptor: true,
    value(dates) {
      const el = findElementWithAssert(this, selector, options);
      if (Ember.isPresent(dates)) {
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

export default PageObject.create({
  dateOptions: setBootstrapDatepicker('#datepicker .ember-view'),
  next: clickable('button[type="submit"]'),
  textOptions: collection({
    itemScope: '.grouped-input .form-group',
    item: {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      title: fillable('input')
    }
  })
});
