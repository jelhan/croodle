/*
* ember-radio by FellowMD
 * https://github.com/FellowMD/ember-radio/blob/master/app/views/radio.js
 */
export default Ember.View.extend({
  tagName: 'input',
  type: 'radio',
  attributeBindings: ['type', 'htmlChecked:checked', 'value', 'name'],
  htmlChecked: function(){
    return this.get('value') === this.get('checked');
  }.property('value', 'checked'),
  change: function(){
    this.set('checked', this.get('value'));
  }
});