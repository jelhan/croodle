/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import { Factory } from 'miragejs';
import encrypt from '../utils/encrypt';

export default Factory.extend({
  anonymousUser: false,
  answerType: 'YesNo',
  creationDate: '2015-04-01T11:11:11.111Z',
  description: 'default description',
  encryptionKey: 'abcdefghijklmnopqrstuvwxyz',
  expirationDate: '',
  forceAnswer: true,
  isDateTime: false,
  options: [
    {
      title: '2017-12-24',
    },
    {
      title: '2018-01-01',
    },
  ],
  pollType: 'FindADate',
  title: 'default title',
  timezone: null,
  version: 'v0.3',

  afterCreate(poll, server) {
    let propertiesToEncrypt = [
      'anonymousUser',
      'answerType',
      'creationDate',
      'description',
      'expirationDate',
      'forceAnswer',
      'options',
      'pollType',
      'timezone',
      'title',
    ];
    encrypt(propertiesToEncrypt, poll, server);
  },
});
