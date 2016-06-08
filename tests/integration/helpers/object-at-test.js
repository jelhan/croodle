import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('object-at', 'Integration | Helper | objectAt', {
  integration: true
});

test('it works', function(assert) {
  this.set('array', [
    {
      name: 'John Doe',
      profession: 'unknown'
    },
    {
      name: 'abc',
      profession: 'def'
    }
  ]);
  this.set('index', 0);
  this.set('key', 'name');
  this.render(hbs`{{object-at array index key}}`);
  assert.equal(
    this.$().text().trim(), 'John Doe', 'simple lookup'
  );
  this.set('index', 1);
  assert.equal(
    this.$().text().trim(), 'abc', 'observes index'
  );
  this.set('key', 'profession');
  assert.equal(
    this.$().text().trim(), 'def', 'observes key'
  );
  this.set('array', [
    {
      name: 'new name 1',
      profession: 'new profession 1'
    },
    {
      name: 'new name 2',
      profession: 'new profession 2'
    }
  ]);
  assert.equal(
    this.$().text().trim(), 'new profession 2', 'observes array'
  );
  this.set('array.lastObject.profession', 'student');
  assert.equal(
    this.$().text().trim(), 'student', 'observes value'
  );
  Ember.run(() => {
    this.get('array').insertAt(1, {
      name: 'added name',
      profession: 'added profession'
    });
  });
  assert.equal(
    this.$().text().trim(), 'added profession', 'observes pushes to array'
  );
});
