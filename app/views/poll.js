export default Ember.View.extend({
  showEvaluation: false,
  
  actions: {
    switchEvaluationVisibility: function() {
      if (this.get('showEvaluation') === true) {
        this.set('showEvaluation', false);
      }
      else {
        this.set('showEvaluation', true);
      }
    }
  },
  
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
      $('.user-selections-table').floatThead({});
    });
  },
  
  showEvaluationLabel: function() {
    if (this.get('showEvaluation')) {
      return "hide";
    }
    else {
      return "show";
    }
  }.property('showEvaluation')
});
