import Ember from "ember";
/* global webshim */

export default Ember.View.extend({
  didInsertElement: function(){
    this._super();

    webshim.setOptions("forms-ext", {
      "time": {
        "nopicker": true,
        "calculateWidth": false
      }
    });

    this.$('input[type="time"]').updatePolyfill();
  }
});
