/* packages/mixins/lib/underscored_adapter_mixin.js */
(function(Ember, DS) {

/**
  @module ember-data
  @submodule mixins
**/

/**
  The `UnderscoredAdapterMixin` is intended use when creating a subclass of the
  DS.RESTAdapter.

  Based on `activemodel-adapter` package, supports `hasMany` and `belongsTo`
  records embedded in JSON payloads, designed to work out of the box with the
  [active_model_serializers](http://github.com/rails-api/active_model_serializers)
  Ruby gem.

  [Mongoid](https://github.com/mongoid/mongoid) supports using `embeds_many` and
  `embeds_one` in (Rails) models. Also `has_one` and `has_many` can be used with
  `ActiveModel::Serializers`. Choose an option for embedding ids or object(s).

  Use to create an adapter based on the DS.RESTAdapter by making consistent use of
  the camelization, decamelization and pluralization methods to normalize the
  serialized JSON into a format that is compatible with a conventional Rails backend
  and Ember Data.

  ## JSON Structure

  The UnderscoredAdapterMixin expects the JSON payload from your server to follow
  the REST adapter conventions substituting underscored keys for camelCased ones.

  ### Conventional Names

  Attribute names in your JSON payload should be the underscored versions of
  the attributes in your Ember.js models.

  For example, if you have a `Person` model:

  ```js
  App.FamousPerson = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    occupation: DS.attr('string')
  });
  ```

  The JSON returned should look like this:

  ```js
  {
    "famous_person": {
      "first_name": "Barack",
      "last_name": "Obama",
      "occupation": "President"
    }
  }
  ```

  @class UnderscoredAdapterMixin
  @constructor
  @namespace DS
**/

DS.UnderscoredAdapterMixin = Ember.Mixin.create({
  /**
    The UnderscoredAdapterMixin overrides the `pathForType` method to build
    underscored URLs by decamelizing and pluralizing the object type name.

    ```js
      this.pathForType("famousPerson");
      //=> "famous_people"
    ```

    @method pathForType
    @param {String} type
    @return String
  */
  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

}(Ember, DS));


;/* packages/mixins/lib/underscored_serializer_mixin.js */
(function(Ember, DS) {

var get = Ember.get;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @module ember-data
  @submodule mixins
**/

/**
  The `UnderscoredSerializer` is intended use when creating a subclass of the
  DS.RESTSerializer.

  Based on `activemodel-adapter` package, supports `hasMany` and `belongsTo`
  records embedded in JSON payloads, designed to work out of the box with the
  [active_model_serializers](http://github.com/rails-api/active_model_serializers)
  Ruby gem. And is designed to integrate with an API that uses an underscored
  naming convention instead of camelCasing.

  @class DS.UnderscoredSerializer
  @constructor
  @namespace DS
**/
DS.UnderscoredSerializer = Ember.Mixin.create({
  // SERIALIZE

  /**
    Converts camelCased attributes to underscored when serializing.

    @method keyForAttribute
    @param {String} attribute
    @return String
  */
  keyForAttribute: function(attr) {
    return Ember.String.decamelize(attr);
  },

  /**
    Underscores relationship names and appends "_id" or "_ids" when serializing
    relationship keys.

    @method keyForRelationship
    @param {String} key
    @param {String} kind
    @return String
  */
  keyForRelationship: function(key, kind) {
    key = Ember.String.decamelize(key);
    if (kind === "belongsTo") {
      return key + "_id";
    } else if (kind === "hasMany") {
      return Ember.String.singularize(key) + "_ids";
    } else {
      return key;
    }
  },

  /**
    Underscores the JSON root keys when serializing.

    @method serializeIntoHash
    @param {Object} hash
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @param {Object} options
  */
  serializeIntoHash: function(data, type, record, options) {
    var root = Ember.String.decamelize(type.typeKey);
    data[root] = this.serialize(record, options);
  },

  /**
    Serializes a polymorphic type as a fully capitalized model name.

    @method serializePolymorphicType
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializePolymorphicType: function(record, json, relationship) {
    var key = relationship.key,
        belongsTo = get(record, key);
    if (belongsTo) {
      key = this.keyForAttribute(key);
      json[key + "_type"] = Ember.String.capitalize(belongsTo.constructor.typeKey);
    }
  },

  // EXTRACT

  /**
    Extracts the model typeKey from underscored root objects.

    @method typeForRoot
    @param {String} root
    @return String the model's typeKey
  */
  typeForRoot: function(root) {
    var camelized = Ember.String.camelize(root);
    return Ember.String.singularize(camelized);
  },

  /**
    Add extra step to `DS.RESTSerializer.normalize` so links are normalized.

    If your payload looks like:

    ```js
    {
      "post": {
        "id": 1,
        "title": "Rails is omakase",
        "links": { "flagged_comments": "api/comments/flagged" }
      }
    }
    ```

    The normalized version would look like this

    ```js
    {
      "post": {
        "id": 1,
        "title": "Rails is omakase",
        "links": { "flaggedComments": "api/comments/flagged" }
      }
    }
    ```

    @method normalize
    @param {subclass of DS.Model} type
    @param {Object} hash
    @param {String} prop
    @return Object
  */

  normalize: function(type, hash, prop) {
    this.normalizeLinks(hash);

    return this._super(type, hash, prop);
  },

  /**
    Convert `snake_cased` links  to `camelCase`

    @method normalizeLinks
    @param {Object} hash
  */

  normalizeLinks: function(data){
    if (data.links) {
      var links = data.links;

      for (var link in links) {
        var camelizedLink = Ember.String.camelize(link);

        if (camelizedLink !== link) {
          links[camelizedLink] = links[link];
          delete links[link];
        }
      }
    }
  },

  /**
    Normalize the polymorphic type from the JSON.

    Normalize:
    ```js
      {
        id: "1"
        minion: { type: "evil_minion", id: "12"}
      }
    ```

    To:
    ```js
      {
        id: "1"
        minion: { type: "evilMinion", id: "12"}
      }
    ```

    @method normalizeRelationships
    @private
  */
  normalizeRelationships: function(type, hash) {
    var payloadKey, payload;

    if (this.keyForRelationship) {
      type.eachRelationship(function(key, relationship) {
        if (relationship.options.polymorphic) {
          payloadKey = this.keyForAttribute(key);
          payload = hash[payloadKey];
          if (payload && payload.type) {
            payload.type = this.typeForRoot(payload.type);
          } else if (payload && relationship.kind === "hasMany") {
            var self = this;
            forEach(payload, function(single) {
              single.type = self.typeForRoot(single.type);
            });
          }
        } else {
          payloadKey = this.keyForRelationship(key, relationship.kind);
          payload = hash[payloadKey];
        }

        hash[key] = payload;

        if (key !== payloadKey) {
          delete hash[payloadKey];
        }
      }, this);
    }
  }
});

}(Ember, DS));


;/* packages/mixins/lib/embedded_mixin.js */
(function(Ember, DS) {

var get = Ember.get;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @module ember-data
  @submodule mixins
**/

/**
  DS.EmbeddedMixin supports serializing embedded records.

  To set up embedded records, include the mixin into a serializer then
  define embedded (model) relationships.

  Below is an example of a per type serializer (post type).

  ```js
  App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
    attrs: {
      author: {embedded: 'always'},
      comments: {embedded: 'always'}
    }
  })
  ```

  Currently only `{embedded: 'always'}` records are supported.

  @class EmbeddedMixin
  @namespace DS
*/
DS.EmbeddedMixin = Ember.Mixin.create({

  /**
    Serialize `belongsTo` relationship when it is configured as an embedded object.

    This example of an author model belongs to a post model:

    ```js
    Post = DS.Model.extend({
      title:    DS.attr('string'),
      body:     DS.attr('string'),
      author:   DS.belongsTo('author')
    });

    Author = DS.Model.extend({
      name:     DS.attr('string'),
      post:     DS.belongsTo('post')
    });
    ```

    Use a custom (type) serializer for the post model to configure embedded author

    ```js
    App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
      attrs: {
        author: {embedded: 'always'}
      }
    })
    ```

    A payload with an attribute configured for embedded records can serialize
    the records together under the root attribute's payload:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "author": {
          "id": "2"
          "name": "dhh"
        }
      }
    }
    ```

    @method serializeBelongsTo
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializeBelongsTo: function(record, json, relationship) {
    var attr = relationship.key, config = this.get('attrs');

    if (!config || !isEmbedded(config[attr])) {
      this._super(record, json, relationship);
      return;
    }
    var key = this.keyForAttribute(attr);
    var embeddedRecord = record.get(attr);
    if (!embeddedRecord) {
      json[key] = null;
    } else {
      json[key] = embeddedRecord.serialize();
      var id = embeddedRecord.get('id');
      if (id) {
        json[key].id = id;
      }
      var parentKey = this.keyForAttribute(relationship.parentType.typeKey);
      if (parentKey) {
        removeId(parentKey, json[key]);
      }
      delete json[key][parentKey];
    }
  },

  /**
    Serialize `hasMany` relationship when it is configured as embedded objects.

    This example of a post model has many comments:

    ```js
    Post = DS.Model.extend({
      title:    DS.attr('string'),
      body:     DS.attr('string'),
      comments: DS.hasMany('comment')
    });

    Comment = DS.Model.extend({
      body:     DS.attr('string'),
      post:     DS.belongsTo('post')
    });
    ```

    Use a custom (type) serializer for the post model to configure embedded comments

    ```js
    App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
      attrs: {
        comments: {embedded: 'always'}
      }
    })
    ```

    A payload with an attribute configured for embedded records can serialize
    the records together under the root attribute's payload:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "body": "I want this for my ORM, I want that for my template language..."
        "comments": [{
          "id": "1",
          "body": "Rails is unagi"
        }, {
          "id": "2",
          "body": "Omakase O_o"
        }]
      }
    }
    ```

    To embed the ids for a related object (using a hasMany relationship):
    ```js
    App.PostSerializer = DS.RESTSerializer.extend(DS.EmbeddedMixin, {
      attrs: {
        comments: {embedded: 'ids'}
      }
    })
    ```

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "body": "I want this for my ORM, I want that for my template language..."
        "comments": ["1", "2"]
      }
    }
    ```

    @method serializeHasMany
    @param {DS.Model} record
    @param {Object} json
    @param relationship
  */
  serializeHasMany: function(record, json, relationship) {
    var attr = relationship.key, config = this.get('attrs'), key;

    if (!config || (!isEmbedded(config[attr]) && !hasEmbeddedIds(config[attr]))) {
      this._super(record, json, relationship);
      return;
    }
    if (hasEmbeddedIds(config[attr])) {
      key = this.keyForRelationship(attr, relationship.kind);
      json[key] = get(record, attr).mapBy(get(this, 'primaryKey'));
    } else {
      key = this.keyForAttribute(attr);
      json[key] = get(record, attr).map(function(relation) {
        var data = relation.serialize(),
            primaryKey = get(this, 'primaryKey');

        data[primaryKey] = get(relation, primaryKey);
        if (data.id === null) {
          delete data.id;
        }
        return data;
      }, this);
    }
  },

  /**
    Extract an embedded object from the payload for a single object
    and add the object in the compound document (side-loaded) format instead.

    A payload with an attribute configured for embedded records needs to be extracted:

    ```js
    {
      "post": {
        "id": 1
        "title": "Rails is omakase",
        "author": {
          "id": 2
          "name": "dhh"
        }
        "comments": []
      }
    }
    ```

    Ember Data is expecting a payload with a compound document (side-loaded) like:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "author": "2"
        "comments": []
      },
      "authors": [{
        "id": "2"
        "post": "1"
        "name": "dhh"
      }]
      "comments": []
    }
    ```

    The payload's `author` attribute represents an object with a `belongsTo` relationship.
    The `post` attribute under `author` is the foreign key with the id for the post

    @method extractSingle
    @param {DS.Store} store
    @param {subclass of DS.Model} primaryType
    @param {Object} payload
    @param {String} recordId
    @param {'find'|'createRecord'|'updateRecord'|'deleteRecord'} requestType
    @return Object the primary response to the original request
  */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partial = payload[root];

    updatePayloadWithEmbedded.call(this, store, primaryType, payload, partial);

    return this._super(store, primaryType, payload, recordId, requestType);
  },

  /**
    Extract embedded objects in an array when an attr is configured for embedded,
    and add them as side-loaded objects instead.

    A payload with an attr configured for embedded records needs to be extracted:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "comments": [{
          "id": "1",
          "body": "Rails is unagi"
        }, {
          "id": "2",
          "body": "Omakase O_o"
        }]
      }
    }
    ```

    Ember Data is expecting a payload with compound document (side-loaded) like:

    ```js
    {
      "post": {
        "id": "1"
        "title": "Rails is omakase",
        "comments": ["1", "2"]
      },
      "comments": [{
        "id": "1",
        "body": "Rails is unagi"
      }, {
        "id": "2",
        "body": "Omakase O_o"
      }]
    }
    ```

    The payload's `comments` attribute represents records in a `hasMany` relationship

    @method extractArray
    @param {DS.Store} store
    @param {subclass of DS.Model} primaryType
    @param {Object} payload
    @return {Array<Object>} The primary array that was returned in response
      to the original query.
  */
  extractArray: function(store, primaryType, payload) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partials = payload[Ember.String.pluralize(root)];

    forEach(partials, function(partial) {
      updatePayloadWithEmbedded.call(this, store, primaryType, payload, partial);
    }, this);

    return this._super(store, primaryType, payload);
  }
});

// checks config for embedded flag
function isEmbedded(config) {
  return config && (config.embedded === 'always' || config.embedded === 'load');
}

// checks config for included ids flag
function hasEmbeddedIds(config) {
  return config && (config.embedded === 'ids');
}

// used to remove id (foreign key) when embedding
function removeId(key, json) {
  var idKey = key + '_id';
  if (json.hasOwnProperty(idKey)) {
    delete json[idKey];
  }
}

// chooses a relationship kind to branch which function is used to update payload
// does not change payload if attr is not embedded
function updatePayloadWithEmbedded(store, type, payload, partial) {
  var attrs = get(this, 'attrs');

  if (!attrs) {
    return;
  }
  type.eachRelationship(function(key, relationship) {
    var config = attrs[key];

    if (isEmbedded(config)) {
      if (relationship.kind === "hasMany") {
        updatePayloadWithEmbeddedHasMany.call(this, store, key, relationship, payload, partial);
      }
      if (relationship.kind === "belongsTo") {
        updatePayloadWithEmbeddedBelongsTo.call(this, store, key, relationship, payload, partial);
      }
    }
  }, this);
}

// handles embedding for `hasMany` relationship
function updatePayloadWithEmbeddedHasMany(store, primaryType, relationship, payload, partial) {
  var serializer = store.serializerFor(relationship.type.typeKey);
  var primaryKey = get(this, 'primaryKey');
  var attr = relationship.type.typeKey;
  // underscore forces the embedded records to be side loaded.
  // it is needed when main type === relationship.type
  var embeddedTypeKey = '_' + Ember.String.pluralize(attr);
  var expandedKey = this.keyForRelationship(primaryType, relationship.kind);
  var attribute  = this.keyForAttribute(primaryType);
  var ids = [];

  if (!partial[attribute]) {
    return;
  }

  payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];

  forEach(partial[attribute], function(data) {
    var embeddedType = store.modelFor(attr);
    updatePayloadWithEmbedded.call(serializer, store, embeddedType, payload, data);
    ids.push(data[primaryKey]);
    payload[embeddedTypeKey].push(data);
  });

  partial[expandedKey] = ids;
  delete partial[attribute];
}

// handles embedding for `belongsTo` relationship
function updatePayloadWithEmbeddedBelongsTo(store, primaryType, relationship, payload, partial) {
  var attrs = this.get('attrs');

  if (!attrs ||
    !(isEmbedded(attrs[Ember.String.camelize(primaryType)]) || isEmbedded(attrs[primaryType]))) {
    return;
  }
  var attr = relationship.type.typeKey;
  var serializer = store.serializerFor(relationship.type.typeKey);
  var primaryKey = get(serializer, 'primaryKey');
  var embeddedTypeKey = Ember.String.pluralize(attr);
  var expandedKey = serializer.keyForRelationship(primaryType, relationship.kind);
  var attribute = serializer.keyForAttribute(primaryType);

  if (!partial[attribute]) {
    return;
  }
  payload[embeddedTypeKey] = payload[embeddedTypeKey] || [];
  var embeddedType = store.modelFor(relationship.type.typeKey);
  for (var key in partial) {
    if (partial.hasOwnProperty(key) && key.camelize() === attr) {
      updatePayloadWithEmbedded.call(serializer, store, embeddedType, payload, partial[key]);
    }
  }
  partial[expandedKey] = partial[attribute].id;
  // Need to move an embedded `belongsTo` object into a pluralized collection
  payload[embeddedTypeKey].push(partial[attribute]);
  // Need a reference to the parent so relationship works between both `belongsTo` records
  partial[attribute][relationship.parentType.typeKey + '_id'] = partial.id;
  delete partial[attribute];
}

}(Ember, DS));


;/* packages/mixins/lib/embedded_in_model_mixin.js */
(function(Ember, DS) {

/**
  @module ember-data
  @submodule mixins
**/

/**
  DS.EmbeddedInModelMixin

  @class EmbeddedInModelMixin
  @namespace DS
*/
DS.EmbeddedInModelMixin = Ember.Mixin.create({

  embeddedDirtyTracker: (function(obj, path) {
    var _this = this;
    if (this.get(path) === 'root.loaded.updated.uncommitted') {
      return this.eachRelationship(function(relation) {
        var _relation;
        _relation = _this.get(relation);
        if ((_relation != null) && _relation.toString().indexOf('Promise') < 0) {
          return _relation.transitionTo('updated.uncommitted');
        }
      });
    }
  }).observes('currentState.stateName')

});

}(Ember, DS));


;/* packages/mixins/lib/model_with_embedded_mixin.js */
(function(Ember, DS) {

var get = Ember.get;

/**
  @module ember-data
  @submodule mixins
**/

/**
  DS.ModelWithEmbeddedMixin

  @class ModelWithEmbeddedMixin
  @namespace DS
*/
DS.ModelWithEmbeddedMixin = Ember.Mixin.create({

  /**
    Observes state changes and notifies related objects to change state

    When record becomes dirty the embeddedNotifier
    notifies embedded records to transition to dirty state

    When record is saved the embeddedNotifier
    notifies embedded records to rollback to a saved state

    @method embeddedNotifier
  **/
  embeddedNotifier: (function(obj, path) {
    var serializer = this.store.serializerFor(this.constructor),
      config = serializer.get('attrs');

    if (!config) return;
    if (this.get(path) === 'root.loaded.updated.uncommitted') {
      enumerateRelationships.call(this, config, serializer, transitionRelatedToDirty);
    } else if (this.get(path) === 'root.loaded.saved') {
      enumerateRelationships.call(this, config, serializer, rollbackRelated);
    }
  }).observes('currentState.stateName')

});

// Check config for embedded flag
function isEmbedded(config) {
  return config && (config.embedded === 'always' || config.embedded === 'load');
}

// Enumerate over relationship objects, check serializer's config
// execute a callback when relationship is embedded
function enumerateRelationships(config, serializer, callback) {
  var relationshipsByName = get(this.constructor, 'relationshipsByName');
  var relationships = relationshipsByName.values;
  for (var relation in relationships) {
    if (!relationships.hasOwnProperty(relation)) continue;
    var key = relationships[relation].key;
    if (!config || !isEmbedded(config[serializer.keyForAttribute(key)])) continue;
    callback(relationships[relation], this.get(key));
  }
}

// Rollback related record
function rollbackRelated(relationship, record) {
  if (!record || record.toString().indexOf('Promise') > 0) return;
  var kind = relationship.kind;
  if (kind === 'belongsTo') {
    rollback(record);
  } else if (kind === 'hasMany') {
    record.content.forEach(rollback);
  }
}

// Call the model's rollback method
function rollback(model) {
  model.rollback();
}

// Transition related record(s) to dirty state
function transitionRelatedToDirty(relationship, record) {
  if (!record || record.toString().indexOf('Promise') > 0) return;
  var kind = relationship.kind;
  if (kind === 'belongsTo') {
    transitionToDirty(record);
  } else if (kind === 'hasMany') {
    record.content.forEach(transitionToDirty);
  }
}

// Transition record to dirty state
function transitionToDirty(record) {
  record.transitionTo('updated.uncommitted');
}

}(Ember, DS));


;/* packages/embedded-adapter/lib/embedded_adapter.js */
/**
  @module ember-data
  @submodule embedded-adapter
**/

var forEach = Ember.EnumerableUtils.forEach;

/**
  DS.EmbeddedAdapter extends the DS.RESTSerializer adding mixin:
  DS.UnderscoredAdapterMixin

  @class EmbeddedAdapter
  @constructor
  @namespace DS
  @extends DS.RESTAdapter
**/

DS.EmbeddedAdapter = DS.RESTAdapter.extend(DS.UnderscoredAdapterMixin, {
  defaultSerializer: '_embedded',

  /**
    DS.UnderscoredAdapterMixin can override the `ajaxError` method
    to return a DS.InvalidError for all 422 Unprocessable Entity
    responses.

    A 422 HTTP response from the server generally implies that the request
    was well formed but the API was unable to process it because the
    content was not semantically correct or meaningful per the API.

    For more information on 422 HTTP Error code see 11.2 WebDAV RFC 4918
    https://tools.ietf.org/html/rfc4918#section-11.2

    @method ajaxError
    @param jqXHR
    @return error
  */
  ajaxError: function(jqXHR) {
    var error = this._super(jqXHR),
      errors = {};

    if (jqXHR && jqXHR.status === 422) {
      var jsonErrors = Ember.$.parseJSON(jqXHR.responseText)["errors"];

      forEach(Ember.keys(jsonErrors), function (key) {
        errors[Ember.String.camelize(key)] = jsonErrors[key];
      });

      return new DS.InvalidError(errors);
    } else if (jqXHR && jqXHR.status === 404) {
      errors['404'] = 'Not Found';
      return new DS.InvalidError(errors);
    } else {
      return error;
    }
  }
});


;/* packages/embedded-adapter/lib/embedded_serializer.js */
/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.EmbeddedSerializer extends the DS.RESTSerializer adding mixins:
  DS.UnderscoredSerializer, DS.EmbeddedMixin

  @class EmbeddedSerializer
  @constructor
  @namespace DS
  @extends DS.RESTSerializer
**/

DS.EmbeddedSerializer = DS.RESTSerializer.extend(
  DS.UnderscoredSerializer,
  DS.EmbeddedMixin
);


;/* packages/embedded-adapter/lib/model_with_embedded.js */
/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.ModelWithEmbedded extends the DS.Model adding mixin:
  DS.ModelWithEmbeddedMixin

  @class ModelWithEmbedded
  @constructor
  @namespace DS
  @extends DS.Model
**/
DS.ModelWithEmbedded = DS.Model.extend(DS.ModelWithEmbeddedMixin);


;/* packages/embedded-adapter/lib/embedded_in_model.js */
/**
  @module ember-data
  @submodule embedded-adapter
**/

/**
  DS.EmbeddedInModel extends the DS.Model adding mixin:
  DS.EmbeddedInModelMixin

  @class EmbeddedInModel
  @constructor
  @namespace DS
  @extends DS.Model
**/
DS.EmbeddedInModel = DS.Model.extend(DS.EmbeddedInModelMixin);


;/* packages/embedded-adapter/lib/initializer.js */
/**
  @module ember-data
  @submodule embedded-adapter
**/

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "embeddedAdapter",

    initialize: function(container, application) {
      application.register('serializer:_embedded', DS.EmbeddedSerializer);
      application.register('adapter:_embedded', DS.EmbeddedAdapter);
    }
  });
});


;