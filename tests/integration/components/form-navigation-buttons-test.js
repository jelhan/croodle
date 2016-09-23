import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-navigation-buttons', 'Integration | Component | form navigation buttons', {
  integration: true
});

test('it renders two buttons as default', function(assert) {
  this.render(hbs`{{form-navigation-buttons}}`);
  assert.equal(this.$('button').length, 2);
});

test('buttons could be disabled', function(assert) {
  this.render(hbs`{{form-navigation-buttons disableNextButton=true disablePrevButton=true}}`);
  assert.equal(this.$('button.next').prop('disabled'), true, 'next button is disabled');
  assert.equal(this.$('button.prev').prop('disabled'), true, 'prev button is disabled');
});

test('could prevent rendering of prev button', function(assert) {
  this.render(hbs`{{form-navigation-buttons renderPrevButton=false}}`);
  assert.ok(this.$('button.prev').length === 0, 'prev button is not rendered');
  assert.ok(this.$('button.next').length === 1, 'next button is rendered');
});
