import Ember from 'ember';

const { Component, computed, get, inject, isPresent } = Ember;

const addArrays = function() {
  const args = Array.prototype.slice.call(arguments);
  const basis = args.shift();

  args.forEach(function(array) {
    array.forEach(function(value, index) {
      if (isPresent(value)) {
        basis[index] = basis[index] + value;
      }
    });
  });

  return basis;
};

export default Component.extend({
  i18n: inject.service(),
  type: 'bar',
  data: computed('users.[]', 'dates.[]', 'dates.@each.formatted', 'pollOptions.[]', 'pollOptions.@each.title', 'i18n.locale', function() {
    let labels;
    if (this.get('isFindADate')) {
      labels = this.get('dates').map((date) => {
        return get(date, 'formatted');
      });
    } else {
      labels = this.get('pollOptions').map((pollOption) => {
        return get(pollOption, 'title');
      });
    }

    let datasets = [];
    const participants = this.get('users.length');

    const yes = this.get('users').map((user) => {
      return user.get('selections').map((selection) => {
        return selection.get('type') === 'yes' ? 1 : 0;
      });
    });
    datasets.push({
      label: this.get('i18n').t('answerTypes.yes.label').toString(),
      backgroundColor: 'rgba(151,187,205,0.5)',
      borderColor: 'rgba(151,187,205,0.8)',
      hoverBackgroundColor: 'rgba(151,187,205,0.75)',
      hoverBorderColor: 'rgba(151,187,205,1)',
      data: addArrays.apply(this, yes).map((value) => Math.round(value / participants * 100))
    });

    if (this.get('answerType') === 'YesNoMaybe') {
      const maybe = this.get('users').map((user) => {
        return user.get('selections').map((selection) => {
          return selection.get('type') === 'maybe' ? 1 : 0;
        });
      });
      datasets.push({
        label: this.get('i18n').t('answerTypes.maybe.label').toString(),
        backgroundColor: 'rgba(220,220,220,0.5)',
        borderColor: 'rgba(220,220,220,0.8)',
        hoverBackgroundColor: 'rgba(220,220,220,0.75)',
        hoverBorderColor: 'rgba(220,220,220,1)',
        data: addArrays.apply(this, maybe).map((value) => Math.round(value / participants * 100))
      });
    }

    return {
      datasets,
      labels
    };
  }),
  options: {
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          callback(value) {
            return `${value} %`;
          },
          max: 100,
          min: 0
        }
      }]
    },
    tooltips: {
      mode: 'label',
      callbacks: {
        label(tooltipItem, data) {
          const { datasets } = data;
          const { datasetIndex } = tooltipItem;
          const { label } = datasets[datasetIndex];
          const value = tooltipItem.yLabel;
          return `${label}: ${value} %`;
        }
      }
    }
  }
});
