import Ember from 'ember';
/* global sjcl */

export default function (attr, key) {
  var defaultAttr = {
    id: 'test',
    title: 'default title',
    description: 'default description',
    pollType: 'FindADate',
    answerType: 'YesNo',
    answers: [
      {
        id: "yes",
        labelTranslation: "answerTypes.yes.label",
        icon: "glyphicon glyphicon-thumbs-up",
        label: "Ja"
      },
      {
        id: "no",
        labelTranslation: "answerTypes.no.label",
        icon: "glyphicon glyphicon-thumbs-down",
        label: "Nein"
      }
    ],
    options: [
      {
        title: "2017-12-24"
      },
      {
        title: "2018-01-01"
      }
    ],
    creationDate: "2015-04-01T11:11:11.111Z",
    forceAnswer: true,
    anonymousUser: false,
    isDateTime: false,
    users: [],
    expirationDate: '',
    timezone: '',
    version: 'v0.3'
  };
  
  var encrypt = function(prop) {
    return sjcl.encrypt(
             key,
             JSON.stringify(prop)
           );
  };
  
  var data = Ember.merge(defaultAttr, attr);

  return [
    200,
    { "Content-Type": "application/json" },
    JSON.stringify({
      poll: {
        id: data.id,
        title: encrypt(data.title),
        description: encrypt(data.description),
        pollType: encrypt(data.pollType),
        answerType: encrypt(data.answerType),
        answers: encrypt(data.answers),
        options: encrypt(data.options),
        creationDate: encrypt(data.creationDate),
        forceAnswer: encrypt(data.forceAnswer),
        anonymousUser: encrypt(data.anonymousUser),
        isDateTime: encrypt(data.isDateTime),
        timezone: encrypt(data.timezone),
        expirationDate: encrypt(data.expirationDate),
        users: data.users,
        version: data.version
      }
    })
  ];
}
