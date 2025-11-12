import { Model, hasMany } from 'miragejs';

export default Model.extend({
  users: hasMany('user'),
});
