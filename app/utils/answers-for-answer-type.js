import { assert } from '@ember/debug';

export default function (answerType) {
  switch (answerType) {
    case 'YesNo':
      return [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
        },
      ];

    case 'YesNoMaybe':
      return [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
        },
        {
          type: 'maybe',
          labelTranslation: 'answerTypes.maybe.label',
          icon: 'glyphicon glyphicon-hand-right',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
        },
      ];

    case 'FreeText':
      return [];

    default:
      assert(`answer type ${answerType} is not supported`);
  }
}
