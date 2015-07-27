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
    timezone: '',
    version: 'v0.3'
  };
  
  var encrypt = function(prop) {
    return String(
      sjcl.encrypt(
        key,
        JSON.stringify(prop)
      )
    );
  };
  
  var data = Ember.merge(defaultAttr, attr);

  return [
    200,
    { "Content-Type": "application/json" },
    JSON.stringify({
      poll: {
        id: data.id,
        encryptedTitle: encrypt(data.title),
        encryptedDescription: encrypt(data.description),
        encryptedPollType: encrypt(data.pollType),
        encryptedAnswerType: encrypt(data.answerType),
        encryptedAnswers: encrypt(data.answers),
        encryptedOptions: encrypt(data.options),
        encryptedCreationDate: encrypt(data.creationDate),
        encryptedForceAnswer: encrypt(data.forceAnswer),
        encryptedAnonymousUser: encrypt(data.anonymousUser),
        encryptedIsDateTime: encrypt(data.isDateTime),
        encryptedTimezone: encrypt(data.timezone),
        users: data.users,
        version: data.version
      }
    })
  ];
}
