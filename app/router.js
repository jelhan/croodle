var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function(){
     this.route('poll', { path: '/poll/:poll_id' });
     this.resource('create', function(){
         this.route('meta');
         this.route('options');
         this.route('options-datetime');
         this.route('settings');
     });
     this.route('404');
});

export default Router;
