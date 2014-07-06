export default function() {
    Ember.TextField.reopen({
        attributeBindings: ['data-option']
    });
}