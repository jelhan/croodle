type OptionSignature = {
  date: string;
};

export default class Option {
  readonly id: string = window.crypto.randomUUID();
  readonly date: string;

  constructor({ date }: OptionSignature) {
    this.date = date;
  }
}
