import { helper } from '@ember/component/helper';
import { next } from '@ember/runloop';
import { assert } from '@ember/debug';

function scrollFirstInvalidElementIntoViewPort() {
  // `schedule('afterRender', function() {})` would be more approperiate but there seems to be a
  // timing issue in Firefox causing the Browser not scrolling up far enough if doing so
  // delaying to next runloop therefore
  next(function() {
    let invalidInput = document.querySelector('.form-control.is-invalid');
    assert(
      'Atleast one form control must be marked as invalid if form submission was rejected as invalid',
      invalidInput
    );

    // focus first invalid control
    invalidInput.focus({ preventScroll: true });

    // scroll to label of first invalid control
    if (
      invalidInput.getBoundingClientRect().top <= 0 ||
      invalidInput.getBoundingClientRect().bottom >= window.innerHeight
    ) {
      let label = document.querySelector(`label[for="${invalidInput.id}"]`);
      label.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

export default helper(function() {
  return scrollFirstInvalidElementIntoViewPort;
});
