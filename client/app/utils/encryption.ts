import { decrypt as sjclDecrypt, encrypt as sjclEncrypt } from 'sjcl';

function decrypt(encryptedValue: string, passphrase: string): unknown {
  return JSON.parse(sjclDecrypt(passphrase, encryptedValue));
}

function encrypt(plainValue: unknown, passphrase: string) {
  return sjclEncrypt(passphrase, JSON.stringify(plainValue));
}

function generatePassphrase(): string {
  const length = 40;
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomArray = new Uint32Array(length);

  window.crypto.getRandomValues(randomArray);

  let passphrase = '';
  for (let j = length; j--; ) {
    passphrase += possible.charAt(
      Math.floor(randomArray[j]! % possible.length),
    );
  }

  return passphrase;
}

export { decrypt, encrypt, generatePassphrase };
