import { moduleForComponent, test } from 'ember-qunit';
import initializer from 'croodle/initializers/ember-form-master-2000';
import Ember from 'ember';

moduleForComponent('fm-field', 'Unit | Component | fm field', {
  needs: ['component:fm-input',
          'component:fm-select',
          'component:fm-textarea',
          'component:fm-errortext',
          'template:components/ember-form-master-2000/fm-field',
          'template:components/ember-form-master-2000/fm-errortext'],
  setup: function(container) {
    this.container.inject = this.container.injection;
    initializer.initialize(null, this.container);
  }
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

test('does not show error before user interaction', function(assert) {
  var component = this.subject();

  Ember.run(function() {
    component.set('errors', ['error message']);
  });

  assert.ok(
    !this.$().hasClass('has-error')
  );
});

test('does show error after user interaction', function(assert) {
  var component = this.subject();

  Ember.run(() => {
    component.set('errors', ['error message']);
    component.send('userInteraction');
  });

  assert.ok(
    this.$().hasClass('has-error')
  );
});

test('does not show errors if error array is empty', function(assert) {
  var component = this.subject();

  Ember.run(() => {
    component.set('errors', []);
    component.send('userInteraction');
  });

  assert.ok(
    !this.$().hasClass('has-error')
  );
});

test('does not show help-block before user interaction', function(assert) {
  var component = this.subject();

  Ember.run(() => {
    component.set('errors', ['error message']);
  });

  assert.equal(
    this.$('.help-block').length,
    0
  );
});

test('does show error message as help-block after user interaction', function(assert) {
  var component = this.subject();

  Ember.run(() => {
    component.set('errors', ['error message']);
    component.send('userInteraction');
  });

  assert.equal(
    this.$('.help-block').length,
    1
  );

  assert.equal(
    this.$('.help-block').text().trim(),
    'error message'
  );
});

test("does not show help-block if there aren't any errors", function(assert) {
  var component = this.subject();

  Ember.run(() => {
    component.set('errors', []);
    component.send('userInteraction');
  });

  assert.equal(
    this.$('.help-block').length,
    0
  );
});
