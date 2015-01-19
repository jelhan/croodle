import Ember from "ember";

export default Ember.ObjectController.extend({
  languageChanged: function() {
    // change language
    var language = this.get('language.selected');
    
    // save language in cookie
    document.cookie="language=" + language + ";" +
                    // give cookie a lifetime of one year
                    "max-age=" + 60*60*24*356 + ";";
    
    // rerender page
    window.location.reload(false);
  }.observes('language.selected')
});