import Ember from "ember";
import translations from "croodle/lang/translations";

export default Ember.View.extend({
  templateName: 'language-switch',
  
  languages: function() {
    var languages = [];
    for(var lang in translations) {
      languages.push(lang);
    }
    return languages;
  }.property()
});
