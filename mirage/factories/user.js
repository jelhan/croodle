/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import { Factory } from 'ember-cli-mirage';
import encrypt from '../utils/encrypt';

export default Factory.extend({
  creationDate: new Date().toISOString(),
  name: 'John Doe',
  selections: [],
  afterCreate(user, server) {
    let propertiesToEncrypt = ['creationDate', 'name', 'selections'];
    encrypt(propertiesToEncrypt, user, server);
  },
});
