import Selection from './selection';
import config from 'croodle/config/environment';
import { encrypt } from '../utils/encryption';
import { apiUrl } from '../utils/api';
import fetch from 'fetch';

export default class User {
  // ISO 8601 date + time string
  creationDate;

  id;

  // user name
  name;

  // array of users selections
  // must be in same order as options property of poll
  selections;

  // Croodle version user got created with
  version;

  constructor({ creationDate, id, name, selections, version }) {
    this.creationDate = creationDate;
    this.id = id;
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

    const responseDocument = await response.json();
    const { id } = responseDocument.user;
    const user = new User({ creationDate, id, name, selections, version });
    poll.users.push(user);
    return user;
  }
}
