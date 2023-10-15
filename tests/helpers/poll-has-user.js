import { isEmpty } from '@ember/utils';
import { findAll } from '@ember/test-helpers';

function pollHasUser(assert, name, selections) {
  let elBase = findAll('.user').find((el) => {
    return el.querySelector('td:nth-child(1)').textContent.trim() === name;
  });
  assert.ok(elBase, `user ${name} exists`);

  if (elBase) {
    selections.forEach((selection, index) => {
      assert.equal(
        elBase.querySelector(`td:nth-child(${index + 2})`).textContent.trim(),
        selection.toString(),
        `selection ${index} is as expected`
      );
    });
  }
}

function pollHasUsersCount(assert, count, message) {
  if (isEmpty(message)) {
    message = 'poll has expected count of users';
  }
  assert.equal(findAll('.user').length, count, message);
}

export default pollHasUser;
export { pollHasUsersCount };
