type EncryptedValue = {
  ciphertext: Array<number>;
  iv: Array<number>;
};

type PollAttributes = {
  encryptedDescription: EncryptedValue;
  encryptedTitle: EncryptedValue;
  salt: Array<number>;
};

export class Poll {
  id: string;
  attributes: PollAttributes;
  options: Option[] = [];

  constructor({ id, attributes }: { id: string; attributes: PollAttributes }) {
    this.id = id;
    this.attributes = attributes;
  }

  addOption(data: { id: string; attributes: OptionAttributes }) {
    const option = new Option(data);
    this.options.push(option);
  }
}

type OptionAttributes = {
  encryptedDate: EncryptedValue;
};

export class Option {
  id: string;
  attributes: OptionAttributes;

  constructor({
    id,
    attributes,
  }: {
    id: string;
    attributes: OptionAttributes;
  }) {
    this.id = id;
    this.attributes = attributes;
  }
}

export const polls = new Map<string, Poll>();
