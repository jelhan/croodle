import PageObject from 'ember-cli-page-object';

let {
  clickable
} = PageObject;

export default PageObject.create({
  next: clickable('button[type="submit"]')
});
