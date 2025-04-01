export type Answer = {
  labelTranslation: string;
  icon: string;
  type: 'yes' | 'no' | 'maybe';
};

export default function (
  answerType: 'YesNo' | 'YesNoMaybe' | 'FreeText',
): Answer[] {
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
  }
}
