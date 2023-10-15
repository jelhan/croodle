import { module, test } from 'qunit';
import { startMirage } from 'croodle/initializers/ember-cli-mirage';
import sjcl from 'sjcl';

module('Integration | Mirage api mocking', function (hooks) {
  hooks.beforeEach(function () {
    this.server = startMirage();
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('poll factory | encrypts properties', function (assert) {
    let encryptionKey = 'abc';
    let poll = this.server.create('poll', {
      description: 'bar',
      encryptionKey,
      title: 'foo',
    });
    assert.equal(JSON.parse(sjcl.decrypt(encryptionKey, poll.title)), 'foo');
    assert.equal(
      JSON.parse(sjcl.decrypt(encryptionKey, poll.description)),
      'bar'
    );
  });

  test('user factory | encrypts properties', function (assert) {
    let encryptionKey = 'abc';
    let user = this.server.create('user', {
      encryptionKey,
      name: 'foo',
    });
    assert.equal(JSON.parse(sjcl.decrypt(encryptionKey, user.name)), 'foo');
  });
});
