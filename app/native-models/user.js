import Selection from './selection';
import config from 'croodle/config/environment';
import { encrypt } from '../utils/encryption';
import { apiUrl } from '../utils/api';

export default class User {
  // ISO 8601 date + time string
  creationDate;

  // user name
  name;

  // array of users selections
  // must be in same order as options property of poll
  selections;

  // Croodle version user got created with
  version;

  constructor({ creationDate, name, selections, version }) {
    this.creationDate = creationDate;
    this.name = name;
    this.selections = selections.map((selection) => new Selection(selection));
    this.version = version;
  }

  static async create({ name, poll, selections }, passphrase) {
    const creationDate = new Date().toISOString();
    const version = config.APP.version;

    const payload = {
      user: {
        creationDate: encrypt(creationDate, passphrase),
        name: encrypt(name, passphrase),
        poll: poll,
        selections: encrypt(selections, passphrase),
        version,
      },
    };

    // TODO: handle network connectivity issues
    const response = await fetch(apiUrl(`/users`), {
      body: JSON.stringify(payload),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(
        `Saving user failed. Server responsed with ${response.status} ${response.statusText}`,
      );
    }

    return new User({ creationDate, name, selections, version });
  }
}
