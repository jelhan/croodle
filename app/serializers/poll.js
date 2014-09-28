export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    users: {embedded: 'always'}
  }
});