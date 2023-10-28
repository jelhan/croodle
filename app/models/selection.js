export default class Answer {
  icon;
  label;
  labelTranslation;
  type;

  constructor({ icon, label, labelTranslation, type }) {
    this.icon = icon;
    this.label = label;
    this.labelTranslation = labelTranslation;
    this.type = type;
  }
}
