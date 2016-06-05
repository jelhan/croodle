import PageObject from 'croodle/tests/page-object';

let {
  clickable,
  collection,
  fillable,
  text
} = PageObject;

export default PageObject.create({
  days: collection({
    itemScope: '.days',
    item: {
      times: collection({
        itemScope: '.form-group',
        item: {
          add: clickable('button.add'),
          delete: clickable('button.delete'),
          time: fillable('input')
        }
      }),
      label: text('.form-group:eq(0) label')
    },
    labels: text('.days .form-group label', { multiple: true })
  }),
  next: clickable('button[type="submit"]')
});
