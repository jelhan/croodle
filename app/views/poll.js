import Ember from "ember";
import moment from "moment";
import $ from "jquery";

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
      var getScrollBarHeight = function(){
        var wide_scroll_html = '<div id="wide_scroll_div_one" style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div id="wide_scroll_div_two" style="height:100%;width:100px"></div></div>'; 
        $("body").append(wide_scroll_html); // Append our div and add the hmtl to your document for calculations
        var scroll_w1 = $("#wide_scroll_div_one").height(); // Getting the width of the surrounding(parent) div - we already know it is 50px since we styled it but just to make sure.
        var scroll_w2 = $("#wide_scroll_div_two").innerHeight(); // Find the inner width of the inner(child) div.
        var scroll_bar_width = scroll_w1 - scroll_w2; // subtract the difference
        $("#wide_scroll_div_one").remove(); // remove the html from your document
        return scroll_bar_width;
      };
      
      $('.user-selections-table').floatThead({
        'scrollingTop': getScrollBarHeight()
      });
      
      /*
       * fix width calculation error caused by bootstrap glyphicon on webkit
       */
      $('.glyphicon').css('width', '14px');
      
      /*
       * scrollbar on top of table
       */
      var topScrollbarInner = $('<div></div>')
              .css('width', $('.user-selections-table').width() )
              .css('height', '1px');
      var topScrollbarOuter = $('<div></div>')
              .addClass('top-scrollbar')
              .css('width', "100%" )
              .css('overflow-x', 'scroll')
              .css('overflow-y', 'hidden')
              .css('position', 'relative')
              .css('z-index', '1002');
      $('.table-scroll').before(
        topScrollbarOuter.append(topScrollbarInner)
      );
      
      /*
       * scrollbar on top of table for thead
       */
      var topScrollbarInnerThead = $('<div></div>')
              .css('width', $('.user-selections-table').width() )
              .css('height', '1px');
      var topScrollbarOuterThead = $('<div></div>')
              .addClass('top-scrollbar-floatThead')
              .css('width', $('.table-scroll').outerWidth() )
              .css('overflow-x', 'scroll')
              .css('overflow-y', 'hidden')
              .css('position', 'fixed')
              .css('top', '-1px')
              .css('z-index', '1002')
              .css('margin-left', ( $('.table-scroll').outerWidth() - $('.table-scroll').width() ) / 2 * (-1) + 'px' )
              .css('margin-right', ( $('.table-scroll').outerWidth() - $('.table-scroll').width() ) / 2 * (-1) + 'px' );
      $('.table-scroll').prepend(
        topScrollbarOuterThead.append(topScrollbarInnerThead).hide()
      );
      
      $('.table-scroll').scroll(function(){
        $('.top-scrollbar').scrollLeft( $('.table-scroll').scrollLeft() );
        $('.top-scrollbar-floatThead').scrollLeft( $('.table-scroll').scrollLeft() );
      });
      $('.top-scrollbar').scroll(function(){
        $('.table-scroll').scrollLeft( $('.top-scrollbar').scrollLeft() );
        $('.top-scrollbar-floatThead').scrollLeft( $('.top-scrollbar').scrollLeft() );
      });
      $('.top-scrollbar-floatThead').scroll(function(){
        $('.table-scroll').scrollLeft( $('.top-scrollbar-floatThead').scrollLeft() );
        $('.top-scrollbar').scrollLeft( $('.top-scrollbar-floatThead').scrollLeft() );
      });
      /*
       * show scrollbar only, if header is fixed
       */
      $(window).scroll(function(){
        var windowTop = $(window).scrollTop(),
            tableTop = $('.table-scroll table').offset().top;
        if( windowTop >= tableTop - getScrollBarHeight() ) {
          $('.top-scrollbar-floatThead').show();
        }
        else {
          $('.top-scrollbar-floatThead').hide();
        }
      });
      
      /*
       * show timezone modal if local timezone differs to timezone poll got created with
       */
      if( this.get('controller.timezoneDiffers') ) {
        $('#timezoneDiffers').modal();
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
