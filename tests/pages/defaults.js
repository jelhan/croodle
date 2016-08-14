import PageObject from 'ember-cli-page-object';

const {
  collection,
  property,
  text
} = PageObject;

/*
 * shared features between all create/* page objects
 */
export const defaultsForCreate = {
  statusBar: collection({
    active: text('.form-steps button.btn-primary'),
    itemScope: '.form-steps button',
    item: {
      isDisabled: property('disabled'),
      text: text()
    }
  })
};
