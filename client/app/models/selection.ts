export type SelectionInput = {
  icon?: string;
  label?: string;
  labelTranslation?: string;
  type?: string;
};

export default class Selection {
  icon?: string;
  label?: string;
  labelTranslation?: string;
  type?: string;

  constructor({ icon, label, labelTranslation, type }: SelectionInput) {
    this.icon = icon;
    this.label = label;
    this.labelTranslation = labelTranslation;
    this.type = type;
  }
}
