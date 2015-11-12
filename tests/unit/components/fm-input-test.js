import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('fm-input', 'Unit | Component | fm input', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('sends action `userInteraction` on focusOut', function(assert) {
  assert.expect(1);

  var component = this.subject();
  var targetObject = {
    userInteraction: function() {
      assert.ok(true, 'action got called');
    }
  };

  // bind target object and action to component
  component.set('targetObject', targetObject);
  component.set('onUserInteraction', 'userInteraction');

  this.$().trigger('focusout');
});


test('sends action `userInteraction` on input', function(assert) {
  assert.expect(1);

  var component = this.subject();
  var targetObject = {
    userInteraction: function() {
      assert.ok(true, 'action got called');
    }
  };

  // bind target object and action to component
  component.set('targetObject', targetObject);
  component.set('onUserInteraction', 'userInteraction');

  this.$().trigger('input');
});
