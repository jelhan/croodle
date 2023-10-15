import { click } from '@ember/test-helpers';

export default function (tab) {
  return click(`.nav-tabs .${tab} a`);
}
