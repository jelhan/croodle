export default class IntlMessage {
  key;
  options;

  constructor(key: string, options?: Record<string, string>) {
    this.key = key;
    this.options = options;
  }
}
