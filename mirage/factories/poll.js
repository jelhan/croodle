/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import { Factory } from 'ember-cli-mirage';
import encrypt from '../utils/encrypt';

export default Factory.extend({
  anonymousUser: false,
  answers: [
    {
      type: 'yes',
      labelTranslation: 'answerTypes.yes.label',
      icon: 'glyphicon glyphicon-thumbs-up',
      label: 'Ja'
    },
    {
      type: 'no',
      labelTranslation: 'answerTypes.no.label',
      icon: 'glyphicon glyphicon-thumbs-down',
      label: 'Nein'
    }
  ],
  answerType: 'YesNo',
  creationDate: '2015-04-01T11:11:11.111Z',
  description: 'default description',
  encryptionKey: 'abcdefghijklmnopqrstuvwxyz',
  expirationDate: '',
  forceAnswer: true,
  isDateTime: false,
  options: [
    {
      title: '2017-12-24'
    },
    {
      title: '2018-01-01'
    }
  ],
  pollType: 'FindADate',
  title: 'default title',
  timezone: '',
  version: 'v0.3',

  afterCreate(poll, server) {
    let propertiesToEncrypt = [
      'anonymousUser',
      'answers',
      'answerType',
      'creationDate',
      'description',
      'expirationDate',
      'forceAnswer',
      'options',
      'pollType',
      'timezone',
      'title'
    ];
    encrypt(propertiesToEncrypt, poll, server);
  }
});
