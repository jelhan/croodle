import DS from "ember-data";

export default DS.RESTAdapter.extend({
  // set namespace to api.php in same subdirectory
  namespace:
    window.location.pathname
    // remove index.html if it's there
    .replace(/index.html$/, '')
    // remove leading and trailing slash
    .replace(/\/$/, '')
    // add api.php
    .concat('/api')
    // remove leading slash
    .replace(/^\//g, '')
});
