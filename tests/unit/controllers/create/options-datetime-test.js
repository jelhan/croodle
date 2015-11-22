import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:create/options-datetime', {
  needs: ['controller:create', 'validator:messages', 'validator:valid-collection', 'validator:collection', 'validator:presence', 'validator:time']
});

test('validations', function(assert) {
  var controller = this.subject();
  controller.set('createController.model', {});
  controller.set('createController.optionsDates', [{title: '2015-01-01'}, {title: '2015-01-02'}]);
  assert.notOk(
    controller.get('validations.isValid'),
    'controller is invalid'
  );
  assert.ok(
    controller.get('optionsDateTimes').every((optionDateTimes) => {
      return optionDateTimes.get('validations.isInvalid');
    }),
    'all date objects are invalid'
  );
  assert.ok(
    controller.get('optionsDateTimes').every((optionDateTimes) => {
      return optionDateTimes.get('times').every((time) => {
        return time.get('validations.isInvalid');
      });
    }),
    'all times for all days are invalid'
  );

  // setting valid times
  controller.get('optionsDateTimes').map((optionDateTimes) => {
    optionDateTimes.get('times').map((time, index) => {
      time.set('value', (index + 1) + ':00');
    });
  });
  assert.equal(
    controller.get('validations.isValid'), true,
    'controller is valid after setting valid times'
  );
  assert.ok(
    controller.get('optionsDateTimes').every((optionDateTimes) => {
      return optionDateTimes.get('validations.isValid');
    }),
    'all date objects are valid after setting valid times'
  );
  assert.ok(
    controller.get('optionsDateTimes').every((optionDateTimes) => {
      return optionDateTimes.get('times').every((time) => {
        return time.get('validations.isValid');
      });
    }),
    'all times for all days are valid after setting valid time'
  );
});
