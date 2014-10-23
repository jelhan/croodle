export default Ember.View.extend(Em.I18n.TranslateableProperties, {
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
      return this.get('showEvaluationLabelHide');
    }
    else {
      return this.get('showEvaluationLabelShow');
    }
  }.property('showEvaluation'),
  
  showEvaluationLabelHideTranslation: "poll.input.showEvaluation.hide",
  showEvaluationLabelShowTranslation: "poll.input.showEvaluation.show"
});
