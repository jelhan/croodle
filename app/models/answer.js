import DS from 'ember-data';
import Fragment from 'ember-data-model-fragments/fragment';

const { attr } = DS;

export default Fragment.extend({
  type: attr('string'),
  label: attr('string'),
  labelTranslation: attr('string'),
  icon: attr('string')
});
