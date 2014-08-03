export default Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
      $('.user-selections-table').floatThead({});
    });
  }
});
