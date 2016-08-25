import Ember from 'ember';
import AutofocusSupportMixin from 'croodle/mixins/autofocus-support';
import { module, test } from 'qunit';

module('Unit | Mixin | autofocus support');

// Replace this with your real tests.
test('it works', function(assert) {
  let AutofocusSupportObject = Ember.Object.extend(AutofocusSupportMixin);
  let subject = AutofocusSupportObject.create();
  assert.ok(subject);
});
