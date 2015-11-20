import { moduleForComponent, test } from 'ember-qunit';
import initializer from 'croodle/initializers/ember-form-master-2000';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('fm-form', 'Unit | Component | fm form', {
  needs: [
    'component:fm-field',
    'component:fm-input',
    'component:fm-radio-group',
    'component:fm-radio',
    'component:fm-errortext',
    'template:components/ember-form-master-2000/fm-field',
    'template:components/ember-form-master-2000/fm-errortext',
    'template:components/ember-form-master-2000/fm-radio-group'
  ],
  setup: function() {
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

test('does show errors on all yield in form elements after submit', function(assert) {
  assert.expect(2);

  var component = this.subject({
    errors: ['error message'],
    template: hbs`
      {{fm-field}}
      {{fm-radio-group}}
    `
  });

  this.render();

  Ember.run(() => {
    component.get('childViews')[0].set('errors', ['error message']);
    component.get('childViews')[1].set('errors', ['error message']);
  });

  assert.equal(
    this.$('.form-group.has-error').length,
    0
  );

  Ember.run(() => {
    this.$().trigger('submit');
  });

    assert.equal(
      this.$('.form-group.has-error').length,
      2
    );
});
