import Option from './option';
import User from './user';
import { TrackedArray } from 'tracked-built-ins';
import { NotFoundError, apiUrl } from '../utils/api';
import { decrypt, encrypt } from '../utils/encryption';
import answersForAnswerType from '../utils/answers-for-answer-type';
import fetch from 'fetch';
import config from 'croodle/config/environment';

const DAY_STRING_LENGTH = 10; // 'YYYY-MM-DD'.length

export default class Poll {
  // Is participation without user name possibile?
  anonymousUser;

  // YesNo, YesNoMaybe or Freetext
  answerType;

  // ISO-8601 combined date and time string in UTC
  creationDate;

  // poll's description
  description;

  // ISO 8601 date + time string in UTC
  expirationDate;

  // Must all options been answered?
  forceAnswer;

  // ID of the poll
  id;

  // array of poll's options
  options;

  // FindADate or MakeAPoll
  pollType;

  // timezone poll got created in (like "Europe/Berlin")
  timezone;

  // polls title
  title;

  // participants of the poll
  users;

  // Croodle version poll got created with
  version;

  get answers() {
    const { answerType } = this;
    return answersForAnswerType(answerType);
  }

  get hasTimes() {
    if (this.isMakeAPoll) {
      return false;
    }

    return this.options.some((option) => {
      return option.title.length > DAY_STRING_LENGTH;
    });
  }

  get isFindADate() {
    return this.pollType === 'FindADate';
  }

  get isFreeText() {
    return this.answerType === 'FreeText';
  }

  get isMakeAPoll() {
    return this.pollType === 'MakeAPoll';
  }

  constructor({
    anonymousUser,
    answerType,
    creationDate,
    description,
    expirationDate,
    forceAnswer,
    id,
    options,
    pollType,
    timezone,
    title,
    users,
    version,
  }) {
    this.anonymousUser = anonymousUser;
    this.answerType = answerType;
    this.creationDate = creationDate;
    this.description = description;
    this.expirationDate = expirationDate;
    this.forceAnswer = forceAnswer;
    this.id = id;
    this.options = options.map((option) => new Option(option));
    this.pollType = pollType;
    this.timezone = timezone;
    this.title = title;
    this.users = new TrackedArray(users);
    this.version = version;
  }

  static async load(id, passphrase) {
    const url = apiUrl(`polls/${id}`);

    // TODO: Handle network connectivity error
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(
          `A poll with ID ${id} could not be found at the server.`,
        );
      } else {
        throw new Error(
          `Unexpected server-side error. Server responsed with ${response.status} (${response.statusText})`,
        );
      }
    }

    // TODO: Handle malformed server response
    const payload = await response.json();

    return new Poll({
      anonymousUser: decrypt(payload.poll.anonymousUser, passphrase),
      answerType: decrypt(payload.poll.answerType, passphrase),
      creationDate: decrypt(payload.poll.creationDate, passphrase),
      description: decrypt(payload.poll.description, passphrase),
      expirationDate: decrypt(payload.poll.expirationDate, passphrase),
      forceAnswer: decrypt(payload.poll.forceAnswer, passphrase),
      id: payload.poll.id,
      options: decrypt(payload.poll.options, passphrase),
      pollType: decrypt(payload.poll.pollType, passphrase),
      timezone: decrypt(payload.poll.timezone, passphrase),
      title: decrypt(payload.poll.title, passphrase),
      users: payload.poll.users.map((user) => {
        return new User({
          creationDate: decrypt(user.creationDate, passphrase),
          id: user.id,
          name: decrypt(user.name, passphrase),
          selections: decrypt(user.selections, passphrase),
          version: user.version,
        });
      }),
      version: payload.poll.version,
    });
  }

  static async create(
    {
      anonymousUser,
      answerType,
      description,
      expirationDate,
      forceAnswer,
      options,
      pollType,
      title,
    },
    passphrase,
  ) {
    const creationDate = new Date().toISOString();
    const version = config.APP.version;
    const timezone =
      pollType === 'FindADate' &&
      options.some(({ title }) => {
        return title >= 'YYYY-MM-DDTHH:mm'.length;
      })
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : null;

    const payload = {
      poll: {
        anonymousUser: encrypt(anonymousUser, passphrase),
        answerType: encrypt(answerType, passphrase),
        creationDate: encrypt(creationDate, passphrase),
        description: encrypt(description, passphrase),
        expirationDate: encrypt(expirationDate, passphrase),
        forceAnswer: encrypt(forceAnswer, passphrase),
        options: encrypt(options, passphrase),
        pollType: encrypt(pollType, passphrase),
        serverExpirationDate: expirationDate,
        timezone: encrypt(timezone, passphrase),
        title: encrypt(title, passphrase),
        version,
      },
    };

    // TODO: Handle network connectivity issue
    const response = await fetch(apiUrl('polls'), {
      body: JSON.stringify(payload),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(
        `Unexpected server-side error. Server responded with ${response.status} (${response.statusText})`,
      );
    }
    const responseDocument = await response.json();
    const { id } = responseDocument.poll;

    return new Poll({
      anonymousUser,
      answerType,
      creationDate,
      description,
      expirationDate,
      forceAnswer,
      id,
      options,
      pollType,
      timezone,
      title,
      users: [],
      version,
    });
  }
}
