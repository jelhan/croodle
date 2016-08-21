import PageObject from 'ember-cli-page-object';
import { defaultsForCreate } from 'croodle/tests/pages/defaults';

const {
  assign
} = Object;

let {
  clickable,
  collection,
  fillable,
  hasClass,
  text
} = PageObject;

export default PageObject.create(assign({}, defaultsForCreate, {
  days: collection({
    itemScope: '.form-group',
    labels: text('label:not(.sr-only)', { multiple: true })
  }),
  times: collection({
    itemScope: '.form-group',
    item: {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      label: text('label'),
      labelIsHidden: hasClass('label', 'sr-only'),
      time: fillable('input')
    }
  })
}));
