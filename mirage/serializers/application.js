import { RestSerializer } from 'ember-cli-mirage';
import { dasherize, pluralize } from 'ember-cli-mirage/utils/inflector';

export default RestSerializer.extend({
  keyForForeignKey(relationshipName) {
    return relationshipName;
  },
  keyForRelationshipIds(type) {
    return type;
  },
  normalize(payload) {
    let [type] = Object.keys(payload);
    let attrs = payload[type];
    let { belongsToAssociations, hasManyAssociations } = this.registry.schema._registry[type].class.prototype;

    let jsonApiPayload = {
      data: {
        type: pluralize(type)
      }
    };

    Object.keys(attrs).forEach((key) => {
      if (key === 'id') {
        // records id
        jsonApiPayload.data.id = attrs.id;
      } else if (
        belongsToAssociations.hasOwnProperty(key) ||
        hasManyAssociations.hasOwnProperty(key)
      ) {
        // relationship
        if (!jsonApiPayload.data.hasOwnProperty('relationships')) {
          jsonApiPayload.data.relationships = {};
        }

        let association = belongsToAssociations.hasOwnProperty(key) ? belongsToAssociations[key] : hasManyAssociations[key];
        let associationType = belongsToAssociations.hasOwnProperty(key) ? 'belongsTo' : 'hasMany';
        let associationModel = association.modelName;
        let relationshipObject = {};

        switch (associationType) {
          case 'belongsTo':
            relationshipObject.data = {
              type: associationModel,
              id: attrs[key]
            };
            break;
          case 'hasMany':
            relationshipObject.data = [];
            attrs[key].forEach((value) => {
              relationshipObject.data.push({
                type: associationModel,
                id: value
              });
            });
            break;
        }

        jsonApiPayload.data.relationships[key] = relationshipObject;
      } else {
        // attribute
        if (!jsonApiPayload.data.hasOwnProperty('attributes')) {
          jsonApiPayload.data.attributes = {};
        }

        jsonApiPayload.data.attributes[dasherize(key)] = attrs[key];
      }
    });

    return jsonApiPayload;
  },
  serializeIds: 'always'
});
