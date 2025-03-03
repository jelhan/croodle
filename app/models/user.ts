import Selection, { type SelectionInput } from './selection';
import config from 'croodle/config/environment';
import { encrypt } from '../utils/encryption';
import { apiUrl } from '../utils/api';
import fetch from 'fetch';
import type Poll from './poll';

type UserInput = {
  creationDate: string;
  id: string;
  name: string | null;
  selections: SelectionInput[];
  version: string;
};

export default class User {
  // ISO 8601 date + time string
  creationDate: string;

  id: string;

  // user name
  name: string | null;

  // array of users selections
  // must be in same order as options property of poll
  selections: Selection[];

  // Croodle version user got created with
  version: string;

  constructor({ creationDate, id, name, selections, version }: UserInput) {
    this.creationDate = creationDate;
    this.id = id;
    this.name = name;
    this.selections = selections.map((selection) => new Selection(selection));
    this.version = version;
  }

  static async create(
    {
      name,
      poll,
      selections,
    }: { name: string | null; poll: Poll; selections: SelectionInput[] },
    passphrase: string,
  ) {
    const creationDate = new Date().toISOString();
    const version = config.APP['version'] as string;

    const payload = {
      user: {
        creationDate: encrypt(creationDate, passphrase),
        name: encrypt(name, passphrase),
        poll: poll.id,
        selections: encrypt(selections, passphrase),
        version,
      },
    };

    // TODO: handle network connectivity issues
    const response = await fetch(apiUrl(`users`), {
      body: JSON.stringify(payload),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(
        `Saving user failed. Server responsed with ${response.status} (${response.statusText})`,
      );
    }

    const responseDocument = (await response.json()) as {
      user: { id: string };
    };
    const { id } = responseDocument.user;
    const user = new User({ creationDate, id, name, selections, version });
    poll.users.push(user);
    return user;
  }
}
