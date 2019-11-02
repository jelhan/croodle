import { helper } from '@ember/component/helper';
import { schedule } from '@ember/runloop';
import { assert } from '@ember/debug';

function scrollFirstInvalidElementIntoViewPort() {
  // focus first invalid control
  schedule('afterRender', function() {
    let invalidInput = document.querySelector('.form-control.is-invalid');
    assert(
      'Atleast one form control must be marked as invalid if form submission was rejected as invalid',
      invalidInput
    );
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
