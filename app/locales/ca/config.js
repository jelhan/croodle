// ember-i18n does not include a configuration for catalan
export default {
  rtl: false,

  pluralForm(n) {
    if (n === 1) {
      return 'one';
    }
    return 'other';
  }
};
