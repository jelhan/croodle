import Ember from "ember";
/* global webshim */

export default Ember.View.extend({
  didInsertElement: function(){
    this._super();

    this.$('input.time').attr('type', 'time');

    webshim.setOptions("forms-ext", {
      "time": {
        "nopicker": true,
        "calculateWidth": false
      }
    });

    this.$('input[type="time"]').updatePolyfill();
  }
});
