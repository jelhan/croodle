import Option from './option';
import { action } from '@ember/object';
import {
  deriveKey,
  encrypt,
  randomPassphrase,
  randomSalt,
} from 'croodle/utils/crypto';

type PollSignature = {
  description: string;
  options: Option[];
  title: string;
};

export default class Poll {
  readonly description: string;
  readonly id: string = window.crypto.randomUUID();
  readonly options: Option[];
  readonly passphrase: string = randomPassphrase();
  readonly salt: Uint8Array = randomSalt();
  readonly title: string;

  constructor({ description, options, title }: PollSignature) {
    this.description = description;
    this.options = options;
    this.title = title;
  }

  @action
  async save(): Promise<void> {
    const { passphrase, salt } = this;
    const key = await deriveKey(passphrase, salt);

    const document = {
      'bulk:data': [
        {
          type: 'polls',
          id: this.id,
          attributes: {
            encryptedDescription: await encrypt(this.description, key),
            encryptedTitle: await encrypt(this.title, key),
            salt: Array.from(this.salt),
          },
        },
      ],
      'bulk:included': await Promise.all(
        this.options.map(async (option) => {
          return {
            type: 'options',
            id: option.id,
            attributes: {
              encryptedDate: await encrypt(option.date, key),
            },
            relationships: {
              poll: {
                data: {
                  type: 'poll',
                  id: this.id,
                },
              },
            },
          };
        })
      ),
    };

    await fetch('/polls', {
      body: JSON.stringify(document),
      headers: {
        'Content-Type':
          'application/vnd.api+json; ext="https://github.com/jelhan/json-api-bulk-create-extension"',
      },
      method: 'POST',
    });

    return;
  }
}
