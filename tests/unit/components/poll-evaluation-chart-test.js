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

test('data is a valid ChartJS dataset for FindADate using poll timezone', function(assert) {
  let options = [
    Ember.Object.create({
      title: '2015-01-01'
    }),
    Ember.Object.create({
      title: '2015-02-02'
    }),
    Ember.Object.create({
      title: '2015-03-03T01:00:00.000Z'
    }),
    Ember.Object.create({
      title: '2015-03-03T11:00:00.000Z'
    })
  ];
  let users = [
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
  ];
  let currentLocale = 'en';
  let momentLongDayFormat = moment.localeData(currentLocale)
    .longDateFormat('LLLL')
    .replace(
      moment.localeData(currentLocale).longDateFormat('LT'), '')
    .trim();
  let component = this.subject({
    answerType: 'YesNoMaybe',
    currentLocale,
    isFindADate: true,
    momentLongDayFormat,
    options,
    timezone: 'Asia/Hong_Kong',
    users
  });
  const data = component.get('data');
  assert.deepEqual(
    data.labels,
    ['Thursday, January 1, 2015', 'Monday, February 2, 2015', 'Tuesday, March 3, 2015 9:00 AM', 'Tuesday, March 3, 2015 7:00 PM'],
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
    options,
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

test('data is a valid ChartJS dataset for FindADate using poll timezone', function(assert) {
  let options = [
    Ember.Object.create({
      title: '2015-01-01'
    }),
    Ember.Object.create({
      title: '2015-02-02'
    }),
    Ember.Object.create({
      title: '2015-03-03T01:00:00.000Z'
    }),
    Ember.Object.create({
      title: '2015-03-03T11:00:00.000Z'
    })
  ];
  let users = [
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
  ];
  let currentLocale = 'en';
  let momentLongDayFormat = moment.localeData(currentLocale)
    .longDateFormat('LLLL')
    .replace(
      moment.localeData(currentLocale).longDateFormat('LT'), '')
    .trim();
  let component = this.subject({
    answerType: 'YesNoMaybe',
    currentLocale,
    isFindADate: true,
    momentLongDayFormat,
    options,
    timezone: 'Asia/Hong_Kong',
    users
  });
  const data = component.get('data');
  assert.deepEqual(
    data.labels,
    ['Thursday, January 1, 2015', 'Monday, February 2, 2015', 'Tuesday, March 3, 2015 9:00 AM', 'Tuesday, March 3, 2015 7:00 PM'],
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

test('data is a valid ChartJS dataset for FindADate using locale timezone', function(assert) {
  let options = [
    Ember.Object.create({
      title: '2015-03-03T01:00:00.000Z'
    })
  ];
  let component = this.subject({
    answerType: 'YesNoMaybe',
    currentLocale: 'en',
    isFindADate: true,
    momentLongDayFormat: '',
    options,
    timezone: undefined,
    users: []
  });
  const data = component.get('data');
  assert.deepEqual(
    data.labels,
    [moment('2015-03-03T01:00:00.000Z').format('LLLL')],
    'Labels are correct'
  );
});
