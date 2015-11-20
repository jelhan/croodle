import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    openModal: function(options){
      var modalController = this.controllerFor( 'modal/' + options.template );
      modalController.set('model', options.model);
      this.render('modal/' + options.template, {
        into: 'application',
        outlet: 'modal',
        controller: modalController
      });
    },

    removeModal: function(){
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
