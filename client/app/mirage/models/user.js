import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  poll: belongsTo('poll'),
});
