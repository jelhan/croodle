import Ember from "ember";
import translations from "croodle/lang/translations";
/* global moment */
/* global webshim */

export default {
  name: 'i18n',
  initialize: function(container, application) {
    // detect browser language
    var language = '';
    
    // have a look if it's already stored in a cookie
    var cookie = document.cookie.replace(" ", "").split(";");
    cookie.forEach(function(t){
      var x = t.split("=");
      if (x[0] === "language") {
        language = x[1];
      }
    });
  
    // if not we do it by browser language
    if (language === '') {
      language = (window.navigator.userLanguage || window.navigator.language).split("-")[0];
    }
    
    // check if language is supported
    if(typeof translations[language] !== "object") {
      language = "en";
    }
  
    Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN = false;
    Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS = true;
    Ember.I18n.translations = translations[language];
    Ember.I18n.locale = language;
    
    // inject into controller
    var languageStorage = Ember.Object.extend({
      selected: language
    });
    container.register('language:current', languageStorage, {singleton: true});
    application.inject('controller', 'language', 'language:current');
    
    // set moment locale
    moment.locale( language );
    
    // set webshim locale
    webshim.activeLang(language);
  }
};
