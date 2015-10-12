import DS from 'ember-data';

export default DS.ModelFragment.extend({
  type: DS.attr('string'),
  label: DS.attr('string'),
  labelTranslation: DS.attr('string'),
  icon: DS.attr('string')
});
