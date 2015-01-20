import DS from "ember-data";

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    users: {
      deserialize: 'records'
    }
  }
});