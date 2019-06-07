import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';

export default Component.extend({
  actions: {
    prev() {
      this.onPrev();
    }
  },

  /**
   * If `true` next button is disabled.
   *
   * @property disableNextButton
   * @type Boolean
   * @default false
   * @public
   */
  disableNextButton: false,

  /**
   * If `true` prev button is disabled.
   *
   * @property disablePrevButton
   * @type Boolean
   * @default false
   * @public
   */
  disablePrevButton: false,

  i18n: service(),

  /**
   * @property nextButtonClasses
   * @type array
   * @private
   */
  nextButtonClasses: computed('renderPrevButton', function() {
    let renderPrevButton = this.renderPrevButton;

    if (renderPrevButton) {
      return ['col-6', 'col-md-8'];
    } else {
      return ['col-md-8', 'offset-md-4'];
    }
  }),

  /**
   * @property nextButtonClassesString
   * @type String
   * @private
   */
  nextButtonClassesString: computed('nextButtonClasses.[]', function() {
    let nextButtonClasses = this.nextButtonClasses;

    return nextButtonClasses.join(' ');
  }),

  /**
   * @property nextButtonText
   * @type String
   * @default t('action.next')
   * @public
   */
  nextButtonText: t('action.next'),

  /**
   * @property prevButtonText
   * @type String
   * @default t('action.back')
   * @public
   */
  prevButtonText: t('action.back'),

  /**
   * If `true` a next button is rendered.
   *
   * @property renderNextButton
   * @type Boolean
   * @default true
   * @public
   */
  renderNextButton: true,

  /**
   * If `true` a prev button is rendered.
   *
   * @property renderPrevButton
   * @type Boolean
   * @default true
   * @public
   */
  renderPrevButton: true
});
