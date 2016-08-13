import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function() {
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
        'scrollingTop': this.getScrollbarHeight
      });

      /*
       * fix width calculation error caused by bootstrap glyphicon on webkit
       */
      Ember.$('.glyphicon').css('width', '14px');

      /*
       * scrollbar on top of table
       */
      const topScrollbarInner = Ember.$('<div></div>')
              .css('width', Ember.$('.user-selections-table').width())
              .css('height', '1px');
      const topScrollbarOuter = Ember.$('<div></div>')
              .addClass('top-scrollbar')
              .css('width', '100%')
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
      const topScrollbarInnerThead = Ember.$('<div></div>')
              .css('width', Ember.$('.user-selections-table').width())
              .css('height', '1px');
      const topScrollbarOuterThead = Ember.$('<div></div>')
              .addClass('top-scrollbar-floatThead')
              .css('width', Ember.$('.table-scroll').outerWidth())
              .css('overflow-x', 'scroll')
              .css('overflow-y', 'hidden')
              .css('position', 'fixed')
              .css('top', '-1px')
              .css('z-index', '1002')
              .css('margin-left', `${(Ember.$('.table-scroll').outerWidth() - Ember.$('.table-scroll').width()) / 2 * (-1)}px`)
              .css('margin-right', `${(Ember.$('.table-scroll').outerWidth() - Ember.$('.table-scroll').width()) / 2 * (-1)}px`);
      Ember.$('.table-scroll').prepend(
        topScrollbarOuterThead.append(topScrollbarInnerThead).hide()
      );

      // add listener to resize scrollbars if window get resized
      Ember.$(window).resize(this.resizeScrollbars);

      /*
       * bind scroll event on all scrollbars
       */
      Ember.$('.table-scroll').scroll(function() {
        Ember.$('.top-scrollbar').scrollLeft(Ember.$('.table-scroll').scrollLeft());
        Ember.$('.top-scrollbar-floatThead').scrollLeft(Ember.$('.table-scroll').scrollLeft());
      });
      Ember.$('.top-scrollbar').scroll(function() {
        Ember.$('.table-scroll').scrollLeft(Ember.$('.top-scrollbar').scrollLeft());
        Ember.$('.top-scrollbar-floatThead').scrollLeft(Ember.$('.top-scrollbar').scrollLeft());
      });
      Ember.$('.top-scrollbar-floatThead').scroll(function() {
        Ember.$('.table-scroll').scrollLeft(Ember.$('.top-scrollbar-floatThead').scrollLeft());
        Ember.$('.top-scrollbar').scrollLeft(Ember.$('.top-scrollbar-floatThead').scrollLeft());
      });

      /*
       * show inner scrollbar only, if header is fixed
       */
      Ember.$(window).scroll(Ember.$.proxy(this.updateScrollbarTopVisibility, this));
    });
  },

  /*
   * calculates horizontal scrollbar height depending on current browser
   */
  getScrollbarHeight() {
    const wideScrollWtml = '<div id="wide_scroll_div_one" style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div id="wide_scroll_div_two" style="height:100%;width:100px"></div></div>';
    Ember.$('body').append(wideScrollWtml); // Append our div and add the hmtl to your document for calculations
    const scrollW1 = Ember.$('#wide_scroll_div_one').height(); // Getting the width of the surrounding(parent) div - we already know it is 50px since we styled it but just to make sure.
    const scrollW2 = Ember.$('#wide_scroll_div_two').innerHeight(); // Find the inner width of the inner(child) div.
    const scrollBarWidth = scrollW1 - scrollW2; // subtract the difference
    Ember.$('#wide_scroll_div_one').remove(); // remove the html from your document
    return scrollBarWidth;
  },

  /*
   * show / hide top scrollbar depending on window position
   * used as event callback when window is scrolled
   */
  updateScrollbarTopVisibility() {
    const windowTop = Ember.$(window).scrollTop();
    const tableTop = Ember.$('.table-scroll table').offset().top;
    if (windowTop >= tableTop - this.getScrollbarHeight()) {
      Ember.$('.top-scrollbar-floatThead').show();

      // update scroll position
      Ember.$('.top-scrollbar-floatThead').scrollLeft(Ember.$('.table-scroll').scrollLeft());
    } else {
      Ember.$('.top-scrollbar-floatThead').hide();
    }
  },

  /*
   * resize scrollbars
   * used as event callback when window is resized
   */
  resizeScrollbars() {
    Ember.$('.top-scrollbar div').css('width', Ember.$('.user-selections-table').width());
    Ember.$('.top-scrollbar-floatThead').css('width', Ember.$('.table-scroll').outerWidth());
    Ember.$('.top-scrollbar-floatThead div').css('width', Ember.$('.user-selections-table').width());
  },

  /*
   * resize scrollbars if document height might be changed
   * and therefore scrollbars might be added
   */
  triggerResizeScrollbars: Ember.observer('controller.isEvaluable', 'controller.model.users.[]', function() {
    Ember.run.next(() => {
      this.resizeScrollbars();
    });
  }),

  /*
   * clean up
   * especially remove event listeners
   */
  willDestroyElement() {
    Ember.$(window).off('resize', this.resizeScrollbars);
    Ember.$(window).off('scroll', this.updateScrollbarTopVisibility);
  }
});
