import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('pollParticipate', function(app, name, selections) {
  if (!Ember.isEmpty(name)) {
    fillIn('.newUser .newUserName input', name);
  }
  
  var isFreeText = find('.newUser .radio').length ? false : true;
  selections.forEach((selection, index) => {
    if (!Ember.isEmpty(selection)) {
      if (isFreeText) {
        fillIn('.newUser .newUserSelection:nth-child(' + (index + 2) + ') input', selection);
      } else {
        click('.newUser .newUserSelection:nth-child(' + (index + 2) + ') .radio .' + selection);
      }
    }
  });
  click('.newUser button');
});
