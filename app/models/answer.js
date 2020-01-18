import classic from 'ember-classic-decorator';
import { attr } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';

@classic
export default class Answer extends Fragment {
  @attr('string')
  type;

  @attr('string')
  label;

  @attr('string')
  labelTranslation;

  @attr('string')
  icon;
}
