export default Ember.Route.extend({
    model: function(params){
        return this.store.find('poll', params.poll_id).then(function(poll) {
            return poll;
        });
    }
});