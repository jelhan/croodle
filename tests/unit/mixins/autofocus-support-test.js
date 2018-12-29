import EmberObject from '@ember/object';
import AutofocusSupportMixin from 'croodle/mixins/autofocus-support';
import { module, test } from 'qunit';

module('Unit | Mixin | autofocus support', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let AutofocusSupportObject = EmberObject.extend(AutofocusSupportMixin);
    let subject = AutofocusSupportObject.create();
    assert.ok(subject);
  });
});
