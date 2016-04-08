import PageObject from 'croodle/tests/page-object';

let {
  clickable
} = PageObject;

export default PageObject.create({
  next: clickable('button[type="submit"]')
});
