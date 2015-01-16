import Ember from "ember";
import translations from "croodle/lang/translations";
/* global Croodle */

export default Ember.View.extend({
  templateName: 'language-switch',
  
  languages: function() {
    var languages = [];
    for(var lang in translations) {
      languages.push(lang);
    }
    return languages;
  }.property(),
  
  languageChanged: function() {
    // change language
    var language = this.get('controller.language.selected');
    
    // save language in cookie
    document.cookie="language=" + language + ";" +
            // give it an lifetime of one year
            "max-age=" + 60*60*24*356 + ";";
    
    // rerender page
    window.location.reload();
  }.observes('controller.language.selected')
});
