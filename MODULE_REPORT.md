## Module Report
### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/create.js` at line 3

```js
import Ember from 'ember';

const { computed, Controller, getOwner, inject } = Ember;

const formStepObject = Ember.Object.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/adapters/application.js` at line 5

```js

const { RESTAdapter } = DS;
const { inject } = Ember;

export default RESTAdapter.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/poll.js` at line 7

```js
  computed,
  Controller,
  inject,
  isEmpty,
  isPresent,
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/create-options-dates.js` at line 4

```js
import moment from 'moment';

const { computed, Component, inject, isArray, isEmpty } = Ember;

export default Component.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/create-options-datetime.js` at line 9

```js
import Form from 'ember-bootstrap/components/bs-form';

const { computed, Component, inject, isArray, isEmpty, isPresent, observer } = Ember;
const { filter, mapBy, readOnly } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/create-options-text.js` at line 5

```js
import { anyBy } from 'ember-array-computed-macros';

const { Component, computed, inject, observer, run } = Ember;

export default Component.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/create-options.js` at line 7

```js
from 'ember-cp-validations';

const { Component, inject } = Ember;

let Validations = buildValidations({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/form-navigation-buttons.js` at line 4

```js
import { translationMacro as t } from 'ember-i18n';

const { Component, computed, get, inject } = Ember;

export default Component.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/language-select.js` at line 4

```js
import localesMeta from 'croodle/locales/meta';

const { Component, computed, inject } = Ember;

export default Component.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/poll-evaluation-chart.js` at line 4

```js
import moment from 'moment';

const { Component, computed, get, inject, isArray, isPresent } = Ember;

const addArrays = function() {
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/models/option.js` at line 12

```js

const { attr } = DS;
const { assert, computed, inject, isEmpty } = Ember;

const Validations = buildValidations({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/create/index.js` at line 7

```js
from 'ember-cp-validations';

const { computed, Controller, getOwner, Object: EmberObject, inject } = Ember;

const Validations = buildValidations({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/create/meta.js` at line 7

```js
from 'ember-cp-validations';

const { computed, Controller, inject } = Ember;

const Validations = buildValidations({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/create/settings.js` at line 13

```js
  copy,
  getOwner,
  inject,
  isEmpty,
  Object: EmberObject,
```

### Unknown Global

**Global**: `Ember.ObjectController`

**Location**: `app/controllers/modal/save-retry.js` at line 3

```js
import Ember from 'ember';

const { $, ObjectController } = Ember;

export default ObjectController.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/poll/evaluation.js` at line 3

```js
import Ember from 'ember';

const { $, computed, Controller, inject } = Ember;

export default Controller.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/poll/participation.js` at line 12

```js
  Controller,
  getOwner,
  inject,
  isEmpty,
  isPresent,
```

### Unknown Global

**Global**: `Ember.K`

**Location**: `tests/helpers/flash-message.js` at line 4

```js
import FlashObject from 'ember-cli-flash/flash/object';

const { K } = Ember;

FlashObject.reopen({ init: K });
```
