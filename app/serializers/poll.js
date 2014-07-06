export default DS.EmbeddedSerializer.extend({
    attrs: {
        users: {embedded: 'load'}
    }
});