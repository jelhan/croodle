import { moduleForComponent, test } from 'ember-qunit';
import moment from 'moment';
import Ember from 'ember';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

moduleForComponent('poll-evaluation-chart', 'Unit | Component | poll evaluation chart', {
  unit: true,
  // https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Testing#unit-tests
  needs: [
    'service:i18n',
    'locale:en/translations',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    moment.locale('en');

    this.container.lookup('service:i18n').set('locale', 'en');
    this.registry.register('locale:en/config', localeConfig);
    this.registry.register('helper:t', tHelper);
  }
});

test('data is a valid ChartJS dataset for FindADate', function(assert) {
  const dates = [
    Ember.Object.create({
      formatted: 'Thursday, January 1, 2015',
      title: moment('2015-01-01'),
      hasTime: false
    }),
    Ember.Object.create({
      formatted: 'Monday, February 2, 2015',
      title: moment('2015-02-02'),
      hasTime: false
    }),
    Ember.Object.create({
      formatted: 'Tuesday, March 3, 2015 1:00 AM',
      title: moment('2015-03-03T01:00'),
      hasTime: true
    }),
    Ember.Object.create({
      formatted: 'Tuesday, March 3, 2015 11:00 AM',
      title: moment('2015-03-03T11:00'),
      hasTime: true
    })
  ];
  let component = this.subject({
    answerType: 'YesNoMaybe',
    dates,
    isFindADate: true,
    users: [
      Ember.Object.create({
        id: 1,
        selections: [
          Ember.Object.create({
            type: 'yes'
          }),
          Ember.Object.create({
            type: 'yes'
          }),
          Ember.Object.create({
            type: 'maybe'
          }),
          Ember.Object.create({
            type: 'no'
          })
        ]
      }),
      Ember.Object.create({
        id: 2,
        selections: [
          Ember.Object.create({
            type: 'yes'
          }),
          Ember.Object.create({
            type: 'maybe'
          }),
          Ember.Object.create({
            type: 'no'
          }),
          Ember.Object.create({
            type: 'no'
          })
        ]
      })
    ]
  });
  const data = component.get('data');
  assert.deepEqual(
    data.labels,
    dates.map((date) => {
      return date.hasTime ? date.title.format('LLLL') : date.title.format(
        moment.localeData()
          .longDateFormat('LLLL')
          .replace(
            moment.localeData().longDateFormat('LT'), '')
          .trim()
      );
    }),
    'Labels are correct'
  );
  assert.equal(
    data.datasets.length,
    2,
    'there are two datasets'
  );
  assert.deepEqual(
    data.datasets.map((dataset) => dataset.label),
    ['Yes', 'Maybe'],
    'datasets having answers as label and are in correct order'
  );
  assert.deepEqual(
    data.datasets[0].data,
    [100, 50, 0, 0],
    'dataset for yes is correct'
  );
  assert.deepEqual(
    data.datasets[1].data,
    [0, 50, 50, 0],
    'dataset for maybe is correct'
  );
});

test('data is a valid ChartJS dataset for MakeAPoll', function(assert) {
  const options = [
    Ember.Object.create({
      title: 'first option'
    }),
    Ember.Object.create({
      title: 'second option'
    }),
    Ember.Object.create({
      title: 'third option'
    }),
    Ember.Object.create({
      title: 'fourth option'
    })
  ];
  let component = this.subject({
    answerType: 'YesNoMaybe',
    pollOptions: options,
    isFindADate: false,
    users: [
      Ember.Object.create({
        id: 1,
        selections: [
          Ember.Object.create({
            type: 'yes'
          }),
          Ember.Object.create({
            type: 'yes'
          }),
          Ember.Object.create({
            type: 'maybe'
          }),
          Ember.Object.create({
            type: 'no'
          })
        ]
      }),
      Ember.Object.create({
        id: 2,
        selections: [
          Ember.Object.create({
            type: 'yes'
          }),
          Ember.Object.create({
            type: 'maybe'
          }),
          Ember.Object.create({
            type: 'no'
          }),
          Ember.Object.create({
            type: 'no'
          })
        ]
      })
    ]
  });
  const data = component.get('data');
  assert.deepEqual(
    data.labels,
    options.map((option) => option.get('title')),
    'Labels are correct'
  );
  assert.equal(
    data.datasets.length,
    2,
    'there are two datasets'
  );
  assert.deepEqual(
    data.datasets.map((dataset) => dataset.label),
    ['Yes', 'Maybe'],
    'datasets having answers as label and are in correct order'
  );
  assert.deepEqual(
    data.datasets[0].data,
    [100, 50, 0, 0],
    'dataset for yes is correct'
  );
  assert.deepEqual(
    data.datasets[1].data,
    [0, 50, 50, 0],
    'dataset for maybe is correct'
  );
});
