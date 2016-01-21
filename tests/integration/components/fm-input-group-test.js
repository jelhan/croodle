import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fm-input-group', 'Integration | Component | fm input group', {
  integration: true
});

test('has class input-group', function(assert) {
  this.render(hbs`{{fm-input-group}}`);

  assert.ok(this.$('div').hasClass('grouped-input'));
});
