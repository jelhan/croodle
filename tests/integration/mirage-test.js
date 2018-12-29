import { get } from '@ember/object';
import { module, test } from 'qunit';
import { startMirage } from 'croodle/initializers/ember-cli-mirage';
import sjcl from 'sjcl';

module('Integration | Mirage api mocking', {
  beforeEach() {
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('poll factory | encrypts properties', function(assert) {
  let encryptionKey = 'abc';
  let poll = this.server.create('poll', {
    description: 'bar',
    encryptionKey,
    title: 'foo'
  });
  assert.equal(JSON.parse(sjcl.decrypt(encryptionKey, get(poll, 'title'))), 'foo');
  assert.equal(JSON.parse(sjcl.decrypt(encryptionKey, get(poll, 'description'))), 'bar');
});

test('user factory | encrypts properties', function(assert) {
  let encryptionKey = 'abc';
  let user = this.server.create('user', {
    encryptionKey,
    name: 'foo'
  });
  assert.equal(JSON.parse(sjcl.decrypt(encryptionKey, get(user, 'name'))), 'foo');
});
