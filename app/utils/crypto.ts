export class EncryptedValue {
  ciphertext: Uint8Array;
  iv: Uint8Array;

  constructor({
    iv,
    ciphertext,
  }: {
    iv: Uint8Array | Array<number>;
    ciphertext: Uint8Array | Array<number>;
  }) {
    this.ciphertext =
      ciphertext instanceof Uint8Array
        ? ciphertext
        : new Uint8Array(ciphertext);
    this.iv = iv instanceof Uint8Array ? iv : new Uint8Array(iv);
  }

  toJSON() {
    return {
      ciphertext: Array.from(this.ciphertext),
      iv: Array.from(this.iv),
    };
  }
}

export async function deriveKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const textEncoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    textEncoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  return key;
}

export async function decrypt(
  encryptedValue: EncryptedValue,
  key: CryptoKey
): Promise<unknown> {
  const { ciphertext, iv } = encryptedValue;
  const encodedPlaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  const textDecoder = new TextDecoder();
  const plaintext = JSON.parse(textDecoder.decode(encodedPlaintext));
  return plaintext;
}

export async function encrypt(
  plaintext: unknown,
  key: CryptoKey
): Promise<EncryptedValue> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const textEncoder = new TextEncoder();
  const ciphertext = new Uint8Array(
    await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      textEncoder.encode(JSON.stringify(plaintext))
    )
  );
  return new EncryptedValue({ iv, ciphertext });
}

export function randomPassphrase(): string {
  const length = 30;

  // Number of available chars must be a divider of 256 to prevent a bias
  // towards chars listed first.
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

  const passphraseAsRandomNumbers = window.crypto.getRandomValues(
    new Uint8Array(length)
  );

  let passphrase = '';
  for (const number of passphraseAsRandomNumbers) {
    const char = chars[number % chars.length];

    if (char === undefined) {
      throw new Error('Mapping of number to chars failed');
    }

    passphrase = passphrase.concat(char);
  }

  return passphrase;
}

/*
 * Returns a salt to be used with PBKDF2 to derive a key from a passphrase.
 * Should be at least 16 bytes per recommendation.
 */
export function randomSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16));
}
