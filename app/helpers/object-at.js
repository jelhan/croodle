import Ember from 'ember';

const { get, isPresent, setProperties } = Ember;

export default Ember.Helper.extend({
  compute([array, index, key]) {
    const lastKey = this.get('key');
    setProperties(this, {
      array,
      key
    });

    // observe array property
    if (key !== lastKey) {
      if (isPresent(lastKey)) {
        this.removeObserver(`array.@each.${lastKey}`, this, 'recompute');
      }
      this.addObserver(`array.@each.${key}`, this, 'recompute');
    }

    const object = array.objectAt(index);
    if (object) {
      return get(array.objectAt(index), key);
    }
    return;
  },
  array: null,
  key: null
});
