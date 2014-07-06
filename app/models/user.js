export default DS.Model.extend({
    poll : DS.belongsTo('poll', {async: true}),
    encryptedName : DS.attr('string'),
    name : Ember.computed.encrypted('encryptedName', 'string'),
    encryptedSelections : DS.attr('string'),
    selections : Ember.computed.encrypted('encryptedSelections', 'array'),
    encryptedCreationDate : DS.attr('string'),
    creationDate : Ember.computed.encrypted('encryptedCreationDate', 'date')
});