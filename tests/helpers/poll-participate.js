import { isEmpty } from '@ember/utils';
import { findAll, fillIn, click, settled } from '@ember/test-helpers';

export default async function(name, selections) {
  if (!isEmpty(name)) {
    await fillIn('.participation .name input', name);
  }

  const isFreeText = findAll('.participation .selections .radio').length > 0 ? false : true;
  for (let [index, selection] of selections.entries()) {
    if (!isEmpty(selection)) {
      if (isFreeText) {
        await fillIn(`.participation .selections .form-group:nth-child(${index + 1}) input`, selection);
      } else {
        await click(`.participation .selections .form-group:nth-child(${index + 1}) .${selection}.radio input`);
      }
    }
  }

  await click('.participation button[type="submit"]');

  await settled();
}
