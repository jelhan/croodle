import { inject as service } from '@ember/service';
import EmberObject, { computed, getProperties } from '@ember/object';
import Controller from '@ember/controller';
import { getOwner } from '@ember/application';

const FormStep = EmberObject.extend({
  router: service(),

  disabled: computed('requiredState', 'visited', function() {
    let { visited, requiredState } = this;
    return !visited || requiredState === false;
  }),
  hidden: false,
  label: null,
  route: null,
  visited: false,

  init() {
    this._super(...arguments);

    let setVisited = () => {
      if (this.router.currentRouteName === this.route) {
        this.set('visited', true);
      }
    };
    this.router.on('routeDidChange', setVisited);
  }
});

const FORM_STEPS = [
  {
    label: 'create.formStep.type',
    route: 'create.index',
  },
  {
    label: 'create.formStep.meta',
    requiredState: computed('model.pollType', function() {
      return this.model.pollType;
    }),
    route: 'create.meta',
  },
  {
    label: computed('model.pollType', function() {
      let { pollType } = this.model;
      return pollType === 'FindADate' ? 'create.formStep.options.days' : 'create.formStep.options.text';
    }),
    requiredState: computed('model.title', function() {
      let { title } = this.model;
      return typeof title === 'string' && title.length >= 2;
    }),
    route: 'create.options',
  },
  {
    hidden: computed('model.pollType', function() {
      let { pollType } = this.model;
      return pollType !== 'FindADate';
    }),
    label: 'create.formStep.options-datetime',
    requiredState: computed('model.options.length', function() {
      return this.model.options.length >= 1;
    }),
    route: 'create.options-datetime'
  },
  {
    label: 'create.formStep.settings',
    requiredState: computed('model.options.length', function() {
      return this.model.options.length >= 1;
    }),
    route: 'create.settings',
  },
];

export default Controller.extend({
  router: service(),

  formSteps: computed('model', function() {
    let owner = getOwner(this);

    return FORM_STEPS.map((definition, index) => {
      let computedProperties = Object.keys(definition).filter((key) => typeof definition[key] === 'function');
      let values = Object.keys(definition).filter((key) => typeof definition[key] !== 'function');

      let extendDefinition = getProperties(definition, ...computedProperties)
      let createDefinition = Object.assign({ model: this.model }, getProperties(definition, ...values));

      if (index === 0) {
        createDefinition.visited = true;
      }

      return FormStep.extend(extendDefinition).create(owner.ownerInjection(), createDefinition);
    });
  })
});
