import { decrypt as sjclDecrypt, encrypt as sjclEncrypt } from 'sjcl';

function decrypt(encryptedValue, passphrase) {
  return JSON.parse(sjclDecrypt(passphrase, encryptedValue));
}

function encrypt(plainValue, passphrase) {
  return sjclEncrypt(passphrase, JSON.stringify(plainValue));
}

function generatePassphrase() {
  const length = 40;
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomArray = new Uint32Array(length);

  window.crypto.getRandomValues(randomArray);

  let passphrase = '';
  for (let j = length; j--; ) {
    passphrase += possible.charAt(Math.floor(randomArray[j] % possible.length));
  }

  return passphrase;
}

export { decrypt, encrypt, generatePassphrase };
