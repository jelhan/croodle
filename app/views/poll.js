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
      
      /*
       * scrollbar on top of table
       */
      var topScrollbarInner = $('<div></div>')
              .css('width', $('.user-selections-table').width() )
              .css('height', '1px');
      var topScrollbarOuter = $('<div></div>')
              .addClass('top-scrollbar')
              .css('width', '100%' )
              .css('overflow-x', 'scroll')
              .css('overflow-y', 'hidden');
      $('.table-scroll').before(
              topScrollbarOuter.append(topScrollbarInner)
      );
      
      $('.table-scroll').scroll(function(){
        $('.top-scrollbar').scrollLeft( $('.table-scroll').scrollLeft() );
      });
      $('.top-scrollbar').scroll(function(){
        $('.table-scroll').scrollLeft( $('.top-scrollbar').scrollLeft() );
      });
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
