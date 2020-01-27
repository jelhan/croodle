import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import moment from 'moment';
import { setupIntl } from 'ember-intl/test-support';

module('Unit | Component | poll evaluation chart', function(hooks) {
  setupTest(hooks);
  setupIntl(hooks, 'en');

  hooks.beforeEach(function() {
    moment.locale('en');
  });

  test('data is a valid ChartJS dataset for FindADate using poll timezone', function(assert) {
    let options = [
      EmberObject.create({
        title: '2015-01-01'
      }),
      EmberObject.create({
        title: '2015-02-02'
      }),
      EmberObject.create({
        title: '2015-03-03T01:00:00.000Z'
      }),
      EmberObject.create({
        title: '2015-03-03T11:00:00.000Z'
      })
    ];
    let users = [
      EmberObject.create({
        id: 1,
        selections: [
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'maybe'
          }),
          EmberObject.create({
            type: 'no'
          })
        ]
      }),
      EmberObject.create({
        id: 2,
        selections: [
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'maybe'
          }),
          EmberObject.create({
            type: 'no'
          }),
          EmberObject.create({
            type: 'no'
          })
        ]
      })
    ];
    let momentLongDayFormat = moment.localeData('en')
      .longDateFormat('LLLL')
      .replace(
        moment.localeData('en').longDateFormat('LT'), '')
      .trim();
    let component = this.owner.factoryFor('component:poll-evaluation-chart').create({
      momentLongDayFormat,
      poll: {
        answerType: 'YesNoMaybe',
        isFindADate: true,
        options,
        users,
      },
      timezone: 'Asia/Hong_Kong',
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
      EmberObject.create({
        title: 'first option'
      }),
      EmberObject.create({
        title: 'second option'
      }),
      EmberObject.create({
        title: 'third option'
      }),
      EmberObject.create({
        title: 'fourth option'
      })
    ];
    let component = this.owner.factoryFor('component:poll-evaluation-chart').create({
      poll: {
        answerType: 'YesNoMaybe',
        options,
        users: [
          EmberObject.create({
            id: 1,
            selections: [
              EmberObject.create({
                type: 'yes'
              }),
              EmberObject.create({
                type: 'yes'
              }),
              EmberObject.create({
                type: 'maybe'
              }),
              EmberObject.create({
                type: 'no'
              })
            ]
          }),
          EmberObject.create({
            id: 2,
            selections: [
              EmberObject.create({
                type: 'yes'
              }),
              EmberObject.create({
                type: 'maybe'
              }),
              EmberObject.create({
                type: 'no'
              }),
              EmberObject.create({
                type: 'no'
              })
            ]
          })
        ]
      }
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
      EmberObject.create({
        title: '2015-01-01'
      }),
      EmberObject.create({
        title: '2015-02-02'
      }),
      EmberObject.create({
        title: '2015-03-03T01:00:00.000Z'
      }),
      EmberObject.create({
        title: '2015-03-03T11:00:00.000Z'
      })
    ];
    let users = [
      EmberObject.create({
        id: 1,
        selections: [
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'maybe'
          }),
          EmberObject.create({
            type: 'no'
          })
        ]
      }),
      EmberObject.create({
        id: 2,
        selections: [
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'maybe'
          }),
          EmberObject.create({
            type: 'no'
          }),
          EmberObject.create({
            type: 'no'
          })
        ]
      })
    ];
    let momentLongDayFormat = moment.localeData('en')
      .longDateFormat('LLLL')
      .replace(
        moment.localeData('en').longDateFormat('LT'), '')
      .trim();
    let component = this.owner.factoryFor('component:poll-evaluation-chart').create({
      momentLongDayFormat,
      poll: {
        answerType: 'YesNoMaybe',
        isFindADate: true,
        options,
        users,
      },
      timezone: 'Asia/Hong_Kong',
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
      EmberObject.create({
        title: '2015-03-03T01:00:00.000Z'
      })
    ];
    let component = this.owner.factoryFor('component:poll-evaluation-chart').create({
      momentLongDayFormat: '',
      poll: {
        answerType: 'YesNoMaybe',
        isFindADate: true,
        options,
        users: [],
      },
    });

    const data = component.get('data');
    assert.deepEqual(
      data.labels,
      [moment('2015-03-03T01:00:00.000Z').format('LLLL')],
      'Labels are correct'
    );
  });
});
