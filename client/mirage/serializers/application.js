import { RestSerializer } from 'miragejs';
import { dasherize } from '../utils/ember-string';
import { pluralize } from 'ember-inflector';

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
    let { belongsToAssociations, hasManyAssociations } =
      this.registry.schema._registry[type].class.prototype;

    let jsonApiPayload = {
      data: {
        type: pluralize(type),
      },
    };

    Object.keys(attrs).forEach((key) => {
      if (key === 'id') {
        // records id
        jsonApiPayload.data.id = attrs.id;
      } else if (key in belongsToAssociations || key in hasManyAssociations) {
        // relationship
        if (!('relationships' in jsonApiPayload.data)) {
          jsonApiPayload.data.relationships = {};
        }

        let association =
          key in belongsToAssociations
            ? belongsToAssociations[key]
            : hasManyAssociations[key];
        let associationType =
          key in belongsToAssociations ? 'belongsTo' : 'hasMany';
        let associationModel = association.modelName;
        let relationshipObject = {};

        switch (associationType) {
          case 'belongsTo':
            relationshipObject.data = {
              type: associationModel,
              id: attrs[key],
            };
            break;
          case 'hasMany':
            relationshipObject.data = [];
            attrs[key].forEach((value) => {
              relationshipObject.data.push({
                type: associationModel,
                id: value,
              });
            });
            break;
        }

        jsonApiPayload.data.relationships[key] = relationshipObject;
      } else {
        // attribute
        if (!('attributes' in jsonApiPayload.data)) {
          jsonApiPayload.data.attributes = {};
        }

        jsonApiPayload.data.attributes[dasherize(key)] = attrs[key];
      }
    });

    return jsonApiPayload;
  },
  serializeIds: 'always',
});
