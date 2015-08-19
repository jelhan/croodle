import DS from "ember-data";
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    users: {
      deserialize: 'records'
    }
  }
});
