import translations from "croodle/lang/translations";

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
    Ember.I18n.translations = translations[language];
    
    // rerender page
    App.reset();
    
    // set cookie when language is changed manualy
    document.cookie="language=" + language + ";" +
            // give it an lifetime of one year
            "max-age=" + 60*60*24*356 + ";";
  }.observes('controller.language.selected')
});
