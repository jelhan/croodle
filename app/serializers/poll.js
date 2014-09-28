export default App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    users: {embedded: 'always'}
  }
});