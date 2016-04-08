import PageObject from 'croodle/tests/page-object';

let {
  clickable,
  fillable
} = PageObject;

export default PageObject.create({
  description: fillable('.description textarea'),
  next: clickable('button[type="submit"]'),
  title: fillable('.title input')
});
