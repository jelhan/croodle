import { helper } from '@ember/component/helper';
import { next } from '@ember/runloop';
import { assert } from '@ember/debug';

function elementIsNotVisible(element) {
  let elementPosition = element.getBoundingClientRect();
  let windowHeight = window.innerHeight;

  // an element is not visible if
  return (
    false ||
    // it's above the current view port
    elementPosition.top <= 0 ||
    // it's below the current view port
    elementPosition.bottom >= windowHeight ||
    // it's in current view port but hidden by fixed navigation
    (getComputedStyle(document.querySelector('.cr-steps-bottom-nav'))
      .position === 'fixed' &&
      elementPosition.bottom >=
        windowHeight -
          document.querySelector('.cr-steps-bottom-nav').offsetHeight)
  );
}

export function scrollFirstInvalidElementIntoViewPort() {
  // `schedule('afterRender', function() {})` would be more approperiate but there seems to be a
  // timing issue in Firefox causing the Browser not scrolling up far enough if doing so
  // delaying to next runloop therefore
  next(function () {
    let invalidInput = document.querySelector(
      '.form-control.is-invalid, .custom-control-input.is-invalid',
    );
    assert(
      'Atleast one form control must be marked as invalid if form submission was rejected as invalid',
      invalidInput,
    );

    // focus first invalid control
    invalidInput.focus({ preventScroll: true });

    // scroll to label or legend of first invalid control if it's not visible yet
    if (elementIsNotVisible(invalidInput)) {
      // Radio groups have a label and a legend. While the label is per input, the legend is for
      // the whole group. Croodle should bring the legend into view in that case.
      // Due to a bug in Ember Bootstrap it renders a `<label>` instead of a `<legend>`:
      // https://github.com/kaliber5/ember-bootstrap/issues/931
      // As a work-a-round we look the correct label up by a custom convention for the `id` of the
      // inputs and the `for` of the input group `<label>` (which should be a `<legend>`).
      let scrollTarget =
        document.querySelector(
          `label[for="${invalidInput.id.substr(
            0,
            invalidInput.id.indexOf('_'),
          )}"`,
        ) ||
        document.querySelector(`label[for="${invalidInput.id}"]`) ||
        // For polls with type `MakeAPoll` the option inputs do not have a label at all. In that case
        // we scroll to the input element itself
        invalidInput;

      scrollTarget.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

export default helper(function () {
  return scrollFirstInvalidElementIntoViewPort;
});
