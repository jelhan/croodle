export default Ember.Route.extend({
    model: function(){
        return this.modelFor('create');
    },

    // redirect to create/index if poll type is not set
    afterModel: function(create){
        if (create.get('pollType') === null) {
            this.transitionTo('create.index');
        }
    }
});