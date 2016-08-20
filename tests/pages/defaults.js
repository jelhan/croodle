import PageObject from 'ember-cli-page-object';

const {
  clickable,
  collection,
  property,
  text
} = PageObject;

/*
 * shared features between all create/* page objects
 */
export const defaultsForCreate = {
  back: clickable('button.back'),
  next: clickable('button[type="submit"]'),
  statusBar: collection({
    active: text('.form-steps button.btn-primary'),
    itemScope: '.form-steps button',
    item: {
      isDisabled: property('disabled'),
      text: text()
    }
  })
};
