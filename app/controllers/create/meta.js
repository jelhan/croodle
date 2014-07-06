export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
    actions: {
        submit: function(){
            // redirect to CreateOptions
            this.transitionToRoute('create.options');
        }
    },
           
    validations: {
        title: {
            presence: true,
            length: {
                minimum: 2
            }
        }
    }
});