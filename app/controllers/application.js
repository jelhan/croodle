import Ember from "ember";
/* global moment */

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),

  languageChanged: function() {
    // change language
    var language = this.get('i18n.locale');

    // save language in cookie
    document.cookie="language=" + language + ";" +
                    // give cookie a lifetime of one year
                    "max-age=" + 60*60*24*356 + ";";

    moment.locale(language);
  }.observes('i18n.locale')
});
