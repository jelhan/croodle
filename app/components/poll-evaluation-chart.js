import Ember from 'ember';

const addArrays = function() {
  const args = Array.prototype.slice.call(arguments);
  const basis = args.shift();

  args.forEach(function(array) {
    array.forEach(function(value, index) {
      if (Ember.isPresent(value)) {
        basis[index] = basis[index] + value;
      }
    });
  });

  return basis;
};

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  type: 'StackedBar',
  data: Ember.computed('users.[]', 'dates.[]', 'dates.@each.formatted', 'i18n.locale', function() {
    const labels = this.get('dates').map((date) => {
      return Ember.get(date, 'formatted');
    });
    let datasets = [];
    const participants = this.get('users.length');
    if (this.get('answerType') === 'YesNoMaybe') {
      const maybe = this.get('users').map((user) => {
        return user.get('selections').map((selection) => {
          return selection.get('type') === 'maybe' ? 1 : 0;
        });
      });
      datasets.push({
        label: this.get('i18n').t('answerTypes.maybe.label').toString(),
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,0.8)',
        highlightFill: 'rgba(220,220,220,0.75)',
        highlightStroke: 'rgba(220,220,220,1)',
        data: addArrays.apply(this, maybe).map((value) => Math.round(value / participants * 100))
      });
    }
    const yes = this.get('users').map((user) => {
      return user.get('selections').map((selection) => {
        return selection.get('type') === 'yes' ? 1 : 0;
      });
    });
    datasets.push({
      label: this.get('i18n').t('answerTypes.yes.label').toString(),
      fillColor: 'rgba(151,187,205,0.5)',
      strokeColor: 'rgba(151,187,205,0.8)',
      highlightFill: 'rgba(151,187,205,0.75)',
      highlightStroke: 'rgba(151,187,205,1)',
      data: addArrays.apply(this, yes).map((value) => Math.round(value / participants * 100))
    });

    return {
      datasets,
      labels
    };
  }),
  options: {
    // fixed scale to 0 to 100%
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 10,
    scaleStartValue: 0,
    // prepand % to y axis values,
    scaleLabel: '<%=value%> %',
    // tooltips
    tooltipTemplate: '<%=datasetLabel%>: <%= value + " %" %>',
    multiTooltipTemplate: '<%=datasetLabel%>: <%= value + " %" %>'
  },
  width: '800',
  height: '400',
  legend: false
});
