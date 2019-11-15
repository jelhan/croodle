import { helper } from '@ember/component/helper';
import { next } from '@ember/runloop';
import { assert } from '@ember/debug';

function scrollFirstInvalidElementIntoViewPort() {
  // `schedule('afterRender', function() {})` would be more approperiate but there seems to be a
  // timing issue in Firefox causing the Browser not scrolling up far enough if doing so
  // delaying to next runloop therefore
  next(function() {
    let invalidInput = document.querySelector('.form-control.is-invalid, .custom-control-input.is-invalid');
    assert(
      'Atleast one form control must be marked as invalid if form submission was rejected as invalid',
      invalidInput
    );

    // focus first invalid control
    invalidInput.focus({ preventScroll: true });

    // scroll to label or legend of first invalid control
    if (
      invalidInput.getBoundingClientRect().top <= 0 ||
      invalidInput.getBoundingClientRect().bottom >= window.innerHeight
    ) {
      // Radio groups have a label and a legend. While the label is per input, the legend is for
      // the whole group. Croodle should bring the legend into view in that case.
      // Due to a bug in Ember Bootstrap it renders a `<label>` instead of a `<legend>`:
      // https://github.com/kaliber5/ember-bootstrap/issues/931
      // As a work-a-round we look the correct label up by a custom convention for the `id` of the
      // inputs and the `for` of the input group `<label>` (which should be a `<legend>`).
      let label =
        document.querySelector(`label[for="${invalidInput.id.substr(0, invalidInput.id.indexOf('_'))}"`) ||
        document.querySelector(`label[for="${invalidInput.id}"]`);

      label.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

export default helper(function() {
  return scrollFirstInvalidElementIntoViewPort;
});
