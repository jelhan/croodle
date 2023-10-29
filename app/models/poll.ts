import Option from './option';
import User from './user';
import { TrackedArray } from 'tracked-built-ins';
import { NotFoundError, apiUrl } from '../utils/api';
import { decrypt, encrypt } from '../utils/encryption';
import answersForAnswerType from '../utils/answers-for-answer-type';
import fetch from 'fetch';
import config from 'croodle/config/environment';
import type { SelectionInput } from './selection';

const DAY_STRING_LENGTH = 10; // 'YYYY-MM-DD'.length

export type AnswerType = 'YesNo' | 'YesNoMaybe' | 'FreeText';
type OptionInput = { title: string }[];
export type PollType = 'FindADate' | 'MakeAPoll';
type PollInput = {
  anonymousUser: boolean;
  answerType: AnswerType;
  creationDate: string;
  description: string;
  expirationDate: string;
  forceAnswer: boolean;
  id: string;
  options: OptionInput;
  pollType: PollType;
  timezone: string | null;
  title: string;
  users: User[];
  version: string;
};

export default class Poll {
  // Is participation without user name possibile?
  anonymousUser: boolean;

  // YesNo, YesNoMaybe or Freetext
  answerType: AnswerType;

  // ISO-8601 combined date and time string in UTC
  creationDate: string;

  // poll's description
  description: string;

  // ISO 8601 date + time string in UTC
  expirationDate: string;

  // Must all options been answered?
  forceAnswer: boolean;

  // ID of the poll
  id: string;

  // array of poll's options
  options: Option[];

  // FindADate or MakeAPoll
  pollType: 'FindADate' | 'MakeAPoll';

  // timezone poll got created in (like "Europe/Berlin")
  timezone: string | null;

  // polls title
  title: string;

  // participants of the poll
  users: TrackedArray<User>;

  // Croodle version poll got created with
  version: string;

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
  }: PollInput) {
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

  static async load(id: string, passphrase: string) {
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
    const payload = (await response.json()) as {
      poll: {
        anonymousUser: string;
        answerType: string;
        creationDate: string;
        description: string;
        expirationDate: string;
        forceAnswer: string;
        id: string;
        options: string;
        pollType: string;
        timezone: string;
        title: string;
        users: {
          creationDate: string;
          id: string;
          name: string;
          selections: string;
          version: string;
        }[];
        version: string;
      };
    };

    return new Poll({
      anonymousUser: decrypt(payload.poll.anonymousUser, passphrase) as boolean,
      answerType: decrypt(payload.poll.answerType, passphrase) as AnswerType,
      creationDate: decrypt(payload.poll.creationDate, passphrase) as string,
      description: decrypt(payload.poll.description, passphrase) as string,
      expirationDate: decrypt(
        payload.poll.expirationDate,
        passphrase,
      ) as string,
      forceAnswer: decrypt(payload.poll.forceAnswer, passphrase) as boolean,
      id: payload.poll.id,
      options: decrypt(payload.poll.options, passphrase) as OptionInput,
      pollType: decrypt(payload.poll.pollType, passphrase) as PollType,
      timezone: decrypt(payload.poll.timezone, passphrase) as string,
      title: decrypt(payload.poll.title, passphrase) as string,
      users: payload.poll.users.map((user) => {
        return new User({
          creationDate: decrypt(user.creationDate, passphrase) as string,
          id: user.id,
          name: decrypt(user.name, passphrase) as string,
          selections: decrypt(user.selections, passphrase) as SelectionInput[],
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
    }: {
      anonymousUser: boolean;
      answerType: AnswerType;
      description: string;
      expirationDate: string;
      forceAnswer: boolean;
      options: OptionInput;
      pollType: PollType;
      title: string;
    },
    passphrase: string,
  ) {
    const creationDate = new Date().toISOString();
    const version = config.APP.version;
    const timezone =
      pollType === 'FindADate' &&
      options.some(({ title }) => {
        return title.length >= 'YYYY-MM-DDTHH:mm'.length;
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
