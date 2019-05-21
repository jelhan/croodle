import { inject as service } from '@ember/service';
import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

const { RESTAdapter } = DS;

export default RESTAdapter.extend(AdapterFetch, {
  encryption: service(),

  // set namespace to api.php in same subdirectory
  namespace:
    window.location.pathname
    // remove index.html if it's there
    .replace(/index.html$/, '')
    // remove tests prefix which is added by testem (starting with a number)
    .replace(/\/\d+\/tests/, '')
    // remove tests prefix which is added by tests run in browser
    .replace(/tests/, '')
    // remove leading and trailing slash
    .replace(/\/$/, '')
    // add api.php
    .concat('/api/index.php')
    // remove leading slash
    .replace(/^\//g, '')
});
