import Ember from "ember";
import {
  validator, buildValidations
}
from 'ember-cp-validations';

var Validations = buildValidations({
  optionsTexts: [
    validator('collection', {
      collection() {
        if (this.get('model.isMakeAPoll')) {
          return true;
        }
      }
    }),
    validator('length', {
      dependentKeys: ['optionsTexts.[]'],
      min() {
        if (!this.get('model.isMakeAPoll')) {
          return 0;
        }
        else {
          return 2;
        }
      },
      message: Ember.I18n.t('create.options.error.notEnoughOptions')
    }),
    validator('valid-collection', {
      dependentKeys: ['optionsTexts.@each.value']
    })
  ],
  optionsDates: [
    validator('collection', {
      collection() {
        if (this.get('isFindADate')) {
          return true;
        }
      }
    }),
    validator('length', {
      min() {
        if (!this.get('isFindADate')) {
          return 0;
        }

        if (this.get('isDateTime')) {
          return 1;
        } else {
          return 2;
        }
      },
      message: Ember.I18n.t('create.options.error.notEnoughDates')
    })
  ]
});

export default Ember.Controller.extend(Validations, {
  needs: 'create',

  isFindADate: Ember.computed.readOnly('model.isFindADate'),
  isMakeAPoll: Ember.computed.readOnly('model.isMakeAPoll'),

  optionsDates: Ember.computed.alias("controllers.create.optionsDates"),
  optionsTexts: Ember.computed.alias("controllers.create.optionsTexts"),
  optionsTextsObject: Ember.computed.readOnly('controllers.create.optionsTextsObject'),

  actions: {
    submit: function(){
      if (this.get('model.isDateTime')) {
        this.transitionToRoute('create.options-datetime');
      }
      else {
        this.transitionToRoute('create.settings');
      }
    }
  },

  /*
   * maps optionsDates for bootstrap datepicker as a simple array of date objects
   */
  optionsBootstrapDatepicker: Ember.computed('optionsDates', {
    get: function() {
      return this.get('optionsDates').map(function(item){
        return item.title;
      });
    },
    set: function(key, value) {
      var newOptionsDates = [];
      if(Ember.isArray(value) && value.length > 0) {
        newOptionsDates = value.map(function(item) {
          return { title: item };
        });
      }
      this.set('optionsDates', newOptionsDates);

      return value;
    },
  })
});
