import Ember from 'ember';
import PageObject from 'ember-cli-page-object';
import { findElementWithAssert } from 'ember-cli-page-object';

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
  dateOptions: setBootstrapDatepicker('.days .ember-view:has(.datepicker:first-child)'),
  dateHasError: isVisible('.days.has-error'),
  dateError: text('.days .help-block'),
  next: clickable('button[type="submit"]'),
  textOptions: collection({
    itemScope: '.form-group.option',
    item: {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      hasError: hasClass('has-error'),
      title: fillable('input')
    }
  })
});
