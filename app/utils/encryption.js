import { decrypt as sjclDecrypt, encrypt as sjclEncrypt } from 'sjcl';

function decrypt(encryptedValue, passphrase) {
  return JSON.parse(sjclDecrypt(passphrase, encryptedValue));
}

function encrypt(plainValue, passphrase) {
  return sjclEncrypt(passphrase, JSON.stringify(plainValue));
}

export { decrypt, encrypt };
