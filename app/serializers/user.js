import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  legacySupport: function(resourceHash) {
    /*
     * Croodle <= 0.3.0:
     * * for answer type "freetext":
     *   selections where a string containing label
     * * all other answer types ("YesNo", "YesNoMaybe"):
     *   selections where stored as child object of "value" property
     *   and selection property "type" where named "id"
     */
    if (!Ember.isEmpty(resourceHash.selections[0].value)) {
      resourceHash.selections.forEach(function(selection, index) {
        if (typeof selection.value === 'string') {
          resourceHash.selections[index] = {
            label: selection.value
          };
        } else {
          resourceHash.selections[index] = {
            icon: selection.value.icon,
            label: selection.value.label,
            labelTranslation: selection.value.labelTranslation,
            type: selection.value.id
          };
        }
      });
    }
    
    return resourceHash;
  }
});
