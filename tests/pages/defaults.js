import PageObject from 'ember-cli-page-object';

const { clickable, collection, fillable, property, text } = PageObject;

const { assign } = Object;

/*
 * shared features between all pages
 */
export const defaultsForApplication = {
  locale: fillable('.language-select'),
};

/*
 * shared features between all create/* page objects
 */
export const defaultsForCreate = assign({}, defaultsForApplication, {
  back: clickable('button.prev'),
  next: clickable('button[type="submit"]'),
  statusBar: collection('.form-steps button', {
    isDisabled: property('disabled'),
    text: text(),
  }),
  activeStep: text('.form-steps button.btn-primary'),
});
