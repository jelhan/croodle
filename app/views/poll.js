import Ember from "ember";
/* global moment */

export default Ember.View.extend(Ember.I18n.TranslateableProperties, {
  showEvaluation: false,
  
  actions: {
    switchEvaluationVisibility: function() {
      if (this.get('showEvaluation') === true) {
        this.set('showEvaluation', false);
      }
      else {
        this.set('showEvaluation', true);
      }
    },
    
    useLocalTimezone: function() {
      this.set('controller.useLocalTimezone', true);
    }
  },
  
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
      /*
       * calculates horizontal scrollbar height depending on current browser
       */
      var getScrollbarHeight = function(){
        var wide_scroll_html = '<div id="wide_scroll_div_one" style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div id="wide_scroll_div_two" style="height:100%;width:100px"></div></div>'; 
        Ember.$("body").append(wide_scroll_html); // Append our div and add the hmtl to your document for calculations
        var scroll_w1 = Ember.$("#wide_scroll_div_one").height(); // Getting the width of the surrounding(parent) div - we already know it is 50px since we styled it but just to make sure.
        var scroll_w2 = Ember.$("#wide_scroll_div_two").innerHeight(); // Find the inner width of the inner(child) div.
        var scroll_bar_width = scroll_w1 - scroll_w2; // subtract the difference
        Ember.$("#wide_scroll_div_one").remove(); // remove the html from your document
        return scroll_bar_width;
      };
      
      /*
       * adding floatThead jQuery plugin to poll table
       * https://mkoryak.github.io/floatThead/
       * 
       * scrollingTop:
       *   Offset from the top of the window where the floating header will
       *   'stick' when scrolling down
       * Since we are adding a browser horizontal scrollbar on top, scrollingTop
       * has to be set to height of horizontal scrollbar which depends on
       * used browser
       */
      Ember.$('.user-selections-table').floatThead({
        'scrollingTop': getScrollbarHeight()
      });
      
      /*
       * fix width calculation error caused by bootstrap glyphicon on webkit
       */
      Ember.$('.glyphicon').css('width', '14px');
      
      /*
       * scrollbar on top of table
       */
      var topScrollbarInner = Ember.$('<div></div>')
              .css('width', Ember.$('.user-selections-table').width() )
              .css('height', '1px');
      var topScrollbarOuter = Ember.$('<div></div>')
              .addClass('top-scrollbar')
              .css('width', "100%" )
              .css('overflow-x', 'scroll')
              .css('overflow-y', 'hidden')
              .css('position', 'relative')
              .css('z-index', '1002');
      Ember.$('.table-scroll').before(
        topScrollbarOuter.append(topScrollbarInner)
      );
      
      /*
       * scrollbar on top of table for thead
       */
      var topScrollbarInnerThead = Ember.$('<div></div>')
              .css('width', Ember.$('.user-selections-table').width() )
              .css('height', '1px');
      var topScrollbarOuterThead = Ember.$('<div></div>')
              .addClass('top-scrollbar-floatThead')
              .css('width', Ember.$('.table-scroll').outerWidth() )
              .css('overflow-x', 'scroll')
              .css('overflow-y', 'hidden')
              .css('position', 'fixed')
              .css('top', '-1px')
              .css('z-index', '1002')
              .css('margin-left', ( Ember.$('.table-scroll').outerWidth() - Ember.$('.table-scroll').width() ) / 2 * (-1) + 'px' )
              .css('margin-right', ( Ember.$('.table-scroll').outerWidth() - Ember.$('.table-scroll').width() ) / 2 * (-1) + 'px' );
      Ember.$('.table-scroll').prepend(
        topScrollbarOuterThead.append(topScrollbarInnerThead).hide()
      );
      
      /*
       * resize scrollbars if window get resized
       */
      Ember.$( window ).resize(function(){
        Ember.$('.top-scrollbar div').css('width', Ember.$('.user-selections-table').width() );
        Ember.$('.top-scrollbar-floatThead').css('width', Ember.$('.table-scroll').outerWidth() );
        Ember.$('.top-scrollbar-floatThead div').css('width', Ember.$('.user-selections-table').width() );
      });
      
      /*
       * bind scroll event on all scrollbars
       */
      Ember.$('.table-scroll').scroll(function(){
        Ember.$('.top-scrollbar').scrollLeft( Ember.$('.table-scroll').scrollLeft() );
        Ember.$('.top-scrollbar-floatThead').scrollLeft( Ember.$('.table-scroll').scrollLeft() );
      });
      Ember.$('.top-scrollbar').scroll(function(){
        Ember.$('.table-scroll').scrollLeft( Ember.$('.top-scrollbar').scrollLeft() );
        Ember.$('.top-scrollbar-floatThead').scrollLeft( Ember.$('.top-scrollbar').scrollLeft() );
      });
      Ember.$('.top-scrollbar-floatThead').scroll(function(){
        Ember.$('.table-scroll').scrollLeft( Ember.$('.top-scrollbar-floatThead').scrollLeft() );
        Ember.$('.top-scrollbar').scrollLeft( Ember.$('.top-scrollbar-floatThead').scrollLeft() );
      });
      
      /*
       * show inner scrollbar only, if header is fixed
       */
      Ember.$(window).scroll(function(){
        var windowTop = Ember.$(window).scrollTop(),
            tableTop = Ember.$('.table-scroll table').offset().top;
        if( windowTop >= tableTop - getScrollbarHeight() ) {
          Ember.$('.top-scrollbar-floatThead').show();
          
          // update scroll position
          Ember.$('.top-scrollbar-floatThead').scrollLeft( Ember.$('.table-scroll').scrollLeft() );
        }
        else {
          Ember.$('.top-scrollbar-floatThead').hide();
        }
      });
      
      /*
       * show timezone modal if
       * - local timezone differs to timezone poll got created with and
       * - poll is datetime 
       */
      if( this.get('controller.timezoneDiffers') && this.get('controller.model.isDateTime') ) {
        Ember.$('#timezoneDiffers').modal();
      }
    });
  },
  
  creationDateFormatted: function() {
    return moment( this.get('controller.creationDate') ).format('LLLL');
  }.property('controller.creationDate'),
  
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
