import { TrackedArray } from 'tracked-built-ins';
import config from 'croodle/config/environment';

const DAY_STRING_LENGTH = 10; // 'YYYY-MM-DD'.length

export default class Poll {
  // Is participation without user name possibile?
  anonymousUser;

  // array of possible answers
  answers;

  // YesNo, YesNoMaybe or Freetext
  answerType;

  // ISO-8601 combined date and time string in UTC
  creationDate;

  // poll's description
  description = '';

  // ISO 8601 date + time string in UTC
  expirationDate;

  // Must all options been answered?
  forceAnswer;

  // array of poll's options
  options;

  // FindADate or MakeAPoll
  pollType;

  // timezone poll got created in (like "Europe/Berlin")
  timezone;

  // polls title
  title;

  // participants of the poll
  users = new TrackedArray();

  // Croodle version poll got created with
  version = config.APP.version;

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
}
