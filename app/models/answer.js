import DS from 'ember-data';
/* global MF */

export default MF.Fragment.extend({
  type: DS.attr('string'),
  label: DS.attr('string'),
  labelTranslation: DS.attr('string'),
  icon: DS.attr('string')
});
