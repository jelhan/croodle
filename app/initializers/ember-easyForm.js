/*
 * make ember-easyForm support Bootstrap 3
 * https://github.com/dockyard/ember-easyForm/wiki/Bootstrap-3-and-Ember-Data-With-Server-Side-Validations
 */
export default {
  name: 'easyForm',
  initialize: function() {

    Ember.EasyForm.Input.reopen({
      classNameBindings: ['wrapperConfig.inputClass', 'wrapperErrorClass'],
      isCheckbox: function() {
        if (this.get('inputOptionsValues.as') === 'checkbox') {
          return true;
        }
        else {
          return false;
        }
      }.property('inputOptionsValues'),
      divWrapperClass: function() {
        if (this.get('inputOptionsValues.as') === 'checkbox') {
          return 'checkbox';
        }
        else {
          return '';
        }
      }.property('inputOptionsValues'),
      
      isEasyForm: true
    });

    Ember.EasyForm.Error.reopen({
      errorText: function() {
        return this.get('errors.firstObject');
      }.property('errors.firstObject').cacheable(),
      updateParentView: function() {
        var parentView = this.get('parentView');
        if(this.get('errors.length') > 0) {
          parentView.set('wrapperErrorClass', 'has-error');
        }else{
          parentView.set('wrapperErrorClass', false);
        }
      }.observes('errors.firstObject')
    });

    Ember.EasyForm.Submit.reopen({
      disabled: function() {
        return this.get('formForModel.disableSubmit');
      }.property('formForModel.disableSubmit')
    });

    //-- Bootstrap 3 Class Names --------------------------------------------
    //-- https://github.com/dockyard/ember-easyForm/issues/47
    Ember.TextSupport.reopen({
      classNames: ['form-control']
    });
    // And add the same classes to Select inputs
    Ember.Select.reopen({
      classNames: ['form-control']
    });

    Ember.EasyForm.Config.registerWrapper('default', {
      inputTemplate: 'form-fields/input',

      labelClass: 'control-label',
      inputClass: 'form-group',
      buttonClass: 'btn btn-primary',
      fieldErrorClass: 'has-error',
      errorClass: 'help-block'
    });
  }
};