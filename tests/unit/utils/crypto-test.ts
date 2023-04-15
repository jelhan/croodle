import {
  EncryptedValue,
  decrypt,
  deriveKey,
  encrypt,
  randomPassphrase,
  randomSalt,
} from 'croodle/utils/crypto';
import { module, test } from 'qunit';

module('Unit | Utility | crypto', function () {
  test('encrypt and decrypt a string', async function (assert) {
    const passphrase = randomPassphrase();
    const salt = randomSalt();
    const key = await deriveKey(passphrase, salt);
    const encryptedValue = await encrypt('secret', key);
    assert.ok(encryptedValue instanceof EncryptedValue);

    const decryptedValue = await decrypt(encryptedValue, key);
    assert.strictEqual(decryptedValue, 'secret');
  });

  test('encrypt and decrypt null', async function (assert) {
    const passphrase = randomPassphrase();
    const salt = randomSalt();
    const key = await deriveKey(passphrase, salt);
    const encryptedValue = await encrypt(null, key);
    assert.ok(encryptedValue instanceof EncryptedValue);

    const decryptedValue = await decrypt(encryptedValue, key);
    assert.strictEqual(decryptedValue, null);
  });

  test('encrypt and decrypt boolean', async function (assert) {
    const passphrase = randomPassphrase();
    const salt = randomSalt();
    const key = await deriveKey(passphrase, salt);
    const encryptedValue = await encrypt(true, key);
    assert.ok(encryptedValue instanceof EncryptedValue);

    const decryptedValue = await decrypt(encryptedValue, key);
    assert.true(decryptedValue);
  });

  test('encrypt and decrypt number', async function (assert) {
    const passphrase = randomPassphrase();
    const salt = randomSalt();
    const key = await deriveKey(passphrase, salt);
    const encryptedValue = await encrypt(1, key);
    assert.ok(encryptedValue instanceof EncryptedValue);

    const decryptedValue = await decrypt(encryptedValue, key);
    assert.strictEqual(decryptedValue, 1);
  });

  test('encrypted value can be encoded as JSON', async function (assert) {
    const passphrase = randomPassphrase();
    const salt = randomSalt();
    const key = await deriveKey(passphrase, salt);
    const encryptedValue = new EncryptedValue(
      JSON.parse(JSON.stringify(await encrypt('secret', key)))
    );
    const decryptedValue = await decrypt(encryptedValue, key);
    assert.strictEqual(decryptedValue, 'secret');
  });

  module('#deriveKey', function () {
    test('it works', async function (assert) {
      const key = await deriveKey('secret', randomSalt());
      assert.ok(key instanceof CryptoKey);
    });
  });

  module('#randomPassphrase', function () {
    test('it works', function (assert) {
      const passphrase = randomPassphrase();
      assert.strictEqual(typeof passphrase, 'string', 'returns a string');
      assert.strictEqual(passphrase.length, 30, 'passphrase has 15 chars');
      assert.ok(
        /^[a-zA-Z0-9_-]+$/.test(passphrase),
        'passphrase only consists out of letters, numbers, underscore and dashes'
      );
      assert.strictEqual(
        passphrase,
        encodeURIComponent(passphrase),
        'passphrase is URL-safe'
      );
    });
  });

  module('#randomSalt', function () {
    test('it works', async function (assert) {
      const salt = randomSalt();
      assert.ok(salt instanceof Uint8Array, 'returns an Uint8Array');
      assert.strictEqual(salt.length, 16, 'array contains 16 items');
    });
  });
});
