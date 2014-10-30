import Ember from "ember";
import webshim from "webshim";

export default Ember.View.extend({
    didInsertElement: function(){
        this._super();

        webshim.setOptions("forms-ext", {
            "time": {
                "nopicker": true,
                "calculateWidth": false
            }
        });

        this.$().updatePolyfill();
    }
});
