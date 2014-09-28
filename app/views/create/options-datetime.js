export default Em.View.extend({
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
