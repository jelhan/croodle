export default Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
      $('.user-selections-table').floatThead({});
    });
    
    $('.evaluation:not(.evaluation-header)').toggle();
    $('.evaluation-header').click(function(){
      $('.evaluation:not(.evaluation-header)').toggle();
    });
  }
});
