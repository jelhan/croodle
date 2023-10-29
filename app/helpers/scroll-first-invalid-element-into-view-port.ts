import { helper } from '@ember/component/helper';
import { next } from '@ember/runloop';
import { assert } from '@ember/debug';

function elementIsNotVisible(element: Element) {
  const elementPosition = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // check if the element is within current view port
  if (
    // above current view port
    elementPosition.top <= 0 ||
    // below current view port
    elementPosition.bottom >= windowHeight
  ) {
    return true;
  }

  // check if element is within current view port button hidden behind
  // fixed bottom navigation bar
  const bottomNavEl = document.querySelector(
    '.cr-steps-bottom-nav',
  ) as HTMLElement | null;
  if (!bottomNavEl) {
    // bottom navigation bar can not overlay element if it does not exist
    return false;
  }

  return (
    getComputedStyle(bottomNavEl).position === 'fixed' &&
    elementPosition.bottom >= windowHeight - bottomNavEl.offsetHeight
  );
}

const scrollFirstInvalidElementIntoViewPort = helper(() => {
  // `schedule('afterRender', function() {})` would be more approperiate but there seems to be a
  // timing issue in Firefox causing the Browser not scrolling up far enough if doing so
  // delaying to next runloop therefore
  next(function () {
    const invalidInput = document.querySelector(
      '.form-control.is-invalid, .custom-control-input.is-invalid',
    ) as HTMLInputElement;
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
      const scrollTarget =
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
});

export default scrollFirstInvalidElementIntoViewPort;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'scroll-first-invalid-element-into-view-port': typeof scrollFirstInvalidElementIntoViewPort;
  }
}
