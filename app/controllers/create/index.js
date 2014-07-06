export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
    actions: {
        submit: function(){
            // redirect to CreateMeta
            this.transitionToRoute('create.meta');
        }
    },
           
    validations: {
        pollType: {
            presence: true,
            inclusion: {
                in: ['FindADate', 'MakeAPoll']
            }
        }
    }
});