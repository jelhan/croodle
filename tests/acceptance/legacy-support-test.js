import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import Pretender from 'pretender';
/* jshint proto: true */
/* global moment */

var application, server;

module('Acceptance | legacy support', {
  beforeEach: function() {
    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();
  },

  afterEach: function() {
    server.shutdown();

    Ember.run(application, 'destroy');
  }
});

test('show a default poll created with v0.3.0', function(assert) {
  var id = 'xDF516KCyI',
      encryptionKey = 'i7yjbKl8X6rObvnN9YuuwCIRdBxx5443T4GTKSny';
  
  server.get('/polls/' + id, function() {
    return [
      200,
      { "Content-Type": "application/json" },
      '{"poll":{"encryptedTitle":"{\\"iv\\":\\"UX3elmjGqNKrEG8VaBQKBQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"nXvJ+mvLM8jWOg2VUMsFtk4MwEc0cDdb2Ult3KgwX\\/Qcckq9ynuemGrB\\"}","encryptedDescription":"{\\"iv\\":\\"XOd2nsI7tPQhJq5TpcTaOQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"Km2lCbdP9UnTG1bCHHWZVSr8itBPDZHPRTR25lTxX\\/kyzbpHv9AalmwW7ho9U+VdT2D4HcjCQXS6gBppkAvouhbhJJBcoCTYyQQWRprLDhlRJDdlXoxvLAQ8mkprYjPbd9hDSgP+wCgeaP4srVfIZ1Nzs\\/aCVX5dZVy0h3xo\\"}","encryptedPollType":"{\\"iv\\":\\"42b5q7Edr81oZQe\\/JbaUhA==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"KL9G5\\/9mUWIMUde8MSPrsL8mVA==\\"}","encryptedAnswerType":"{\\"iv\\":\\"D6ILcXVWJjJrqVcOvIpaPQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"UfNLQ\\/\\/oyu1k\\/QGFMj1z\\"}","encryptedAnswers":"{\\"iv\\":\\"NJ+zUA8q\\/1kCTZ6RvUtVWA==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"RG2+2EMqIcomBHhTYvLj2\\/tk5sO\\/JcNUDO9nSW\\/6I2eHD6qICQyvh9AANEDca39fGSsyIDWdEGb5vUBO698U3tKmbLT5Wc+VnpUibZNkKudrhwyAW6ZBXqQbACFHcwIrEDzAcmcJEEpF2LfB07VSBAZv3+uBc1L8KJdpYpnnJEk8Vrh3XuICqFK4i9AxJEhoWu+WG4D8K8G+cVnK20JYVUykNwO5cwqxOGWOb04gTPVT8zflX6z99ur1u6QqpIMO9hUUX54y25XuARbm\\/wCLsXAifM\\/K8b0vWjrRYgcnTvno\\/rk=\\"}","encryptedOptions":"{\\"iv\\":\\"zbNGX5ve+E0ciwgQOwiUyQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"iC7lhzhChLa0dNZWUw9EEQQbTKwnsFQuGhslARzstggj4AG1f1mOdd1ExipGkye66TQ5SyCV3A==\\"}","encryptedCreationDate":"{\\"iv\\":\\"tX2yNkFpx9mEk1DB1UdFGg==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"546yKMVB2jRhjUtqJWT\\/C+irV7JjG0WgJp3+Ag3QkMny6Q==\\"}","encryptedForceAnswer":"{\\"iv\\":\\"Erp3h7I11PeHZhL60+\\/4CQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"yTm6HgIhNC8UHSzP\\"}","encryptedAnonymousUser":"{\\"iv\\":\\"c6EOvuJYw8eNCxnFAJ0eTw==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"CO7J61aKRneZno7bCg==\\"}","encryptedIsDateTime":"{\\"iv\\":\\"1iHh8UZYj3Aqyl\\/nM06fRQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"x6b6MeO8ipO2K38GxA==\\"}","encryptedTimezone":"{\\"iv\\":\\"kZc64suFcN5PO3VsRvGQbw==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"ataOh9JNWpvhjA==\\"}","version":"v0.3-0","id":"xDF516KCyI","users":[{"encryptedName":"{\\"iv\\":\\"pE4nQuD924O+ODNYRWJ7jg==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"m4EzKUdHStkFjcvt5q0MlusOESk4ew==\\"}","encryptedSelections":"{\\"iv\\":\\"VXGMuKcGpizAwFvpztXM3A==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"HeIxQ\\/bU11G0\\/fDXUkKzO94RpK72Ytnof2Hm11pqY3Lwot7kfxpLJ6DD3kKGVYruMe375Hii3bsXOjAroMAe+KUQ9SG0y0aOhJRCc\\/P8O6sAg6NPwBx\\/71LXxxaLr8ORDFzyCwZx3kjXWNS7j017w\\/zJNHJbzY7CimRaG8dtbK5UFFjb28T1SRmLzOvaQ4yJgaTbsnGBIeMrVI9qiEQ1Uo44bRqT6Js9OBzykt\\/aU4FXce3iJ3hctbeYqPRx\\/+TJTS07Wf6LYZG0VRhFhRqmIJLky3PhyZsXgwtY0gJJDyLa9ctN7POurxoFXzyk4fk1AANtHUDVbA==\\"}","encryptedCreationDate":"{\\"iv\\":\\"GUDjdSw2hW2e0wBhwoPx3Q==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Sv34vSd\\/b14=\\",\\"ct\\":\\"zMRHnbJF28bidi6+9uN9T+CvlrvtZzi4nrLeqQuwHpUj5Q==\\"}","version":"v0.3-0","poll":"xDF516KCyI","id":"0"}]}}'
    ];
  });

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    pollTitleEqual(assert, 'default poll created with v0.3.0');
    pollDescriptionEqual(assert, 'two dates selected: 1.1.2016, 2.2.2016; no times specified\nanswers: yes, no\nanonymous user: no\nforce answers: yes');
   
    pollHasOptions(assert, [ 
      moment('2016-01-01').format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      ),
      moment('2016-02-02').format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      ),
    ]);
    
    assert.ok(
      find('input', find('.newUserSelection')[0]).length,
      'answers are correct (count)'
    );
    assert.ok(
      find('.newUserSelection label .yes') && find('.newUserSelection label .no'),
      'answers are correct (class)'
    );

    pollHasAnswers(assert, ['Yes','No']);

    pollHasUsersCount(assert, 1);
    pollHasUser(assert, 'Juri Gagarin', [Ember.I18n.t('answerTypes.yes.label'), Ember.I18n.t('answerTypes.no.label')]);
  });
});

test('show a poll (makeAPoll, freeText) created with v0.3.0', function(assert) {
  var id = 'NLI7U2QEOE',
      encryptionKey = 'tEig58l8DsEw8B629Kc544VvmegkYfbd1GozImKj';
  
  server.get('/polls/' + id, function() {
    return [
      200,
      { "Content-Type": "application/json" },
      '{"poll":{"encryptedTitle":"{\\"iv\\":\\"qPvy66kw9BDSGeMRE0kAVA==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"3eHLf1mM8Sbu8w6mPpQxoTVbo\\/z8myRMAemCYvCh+jA16myx2Oq5CHtVFBI+0v7jdWtBWHAU\\/xo=\\"}","encryptedDescription":"{\\"iv\\":\\"YTeSNaW622Jq5FP+ViYKqw==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"nxUebyFUKF6bnSyg6MRleJ4M8oHEtCIsiXFlZbXfTBt9Ryk7dNAAzDfTnJzdzxzTvUXHPCkHVP2rHhLq3CKgAkJDo1AmU2p4Qcc=\\"}","encryptedPollType":"{\\"iv\\":\\"nAsa8b4WuvoT4q5PrZ\\/APw==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"aysnMipL7WAAylWIcjeeOvovDQ==\\"}","encryptedAnswerType":"{\\"iv\\":\\"X\\/s19dp4Xx8FWfljx13n7A==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"iPBCoXKzCDwZqkUXAUGIeZLp\\"}","encryptedAnswers":"{\\"iv\\":\\"dkrELfNfFpXDItFEZdDPIw==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"XuDMfuNVnk0R7w==\\"}","encryptedOptions":"{\\"iv\\":\\"5Ta3GQeDl43b07eYnHjDyQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"d6oQ4wslFq80bxQZHF53sfiJyEZUYnJ4rNMQGsM03B+wug99ijQif9BGucMJ9bbNz8cD\\"}","encryptedCreationDate":"{\\"iv\\":\\"Hrh0aKUB3suiZurJksVExQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"BeGbWW55MXFKcshjmEWVCMGZ\\/5h1VF52LjLEQUGCBsyKWg==\\"}","encryptedForceAnswer":"{\\"iv\\":\\"84p+nSsIAOJHv\\/FprCsvDg==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"Y4o5JddmJ+4bq5Z2\\"}","encryptedAnonymousUser":"{\\"iv\\":\\"FwrZNpE05Dwk3Kwsd835vw==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"OacRpsJn7NhePn61Eg==\\"}","encryptedIsDateTime":"{\\"iv\\":\\"+8oX1bwIzPhhteIwH1Ce+w==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"tsv6mHV2vdziajjq3w==\\"}","encryptedTimezone":"{\\"iv\\":\\"ZY\\/UQmqSHQWUuVncuS3j\\/w==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"rnjPdsDJcbeciw==\\"}","version":"v0.3-0","id":"NLI7U2QEOE","users":[{"encryptedName":"{\\"iv\\":\\"\\/LdIkuVBjJBJRXYuJfyBlQ==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"rGsCm8TWuV4fjF1lDXaAmDmA79mx\\"}","encryptedSelections":"{\\"iv\\":\\"AfALavJ3clleK1ku63XC2A==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"6i77y3I8iZJkUuxJb+pc0a1zdSA3otK3d660cI9CCOpgmsZsQGkgq6x2XN9dSgdrMLrXAw==\\"}","encryptedCreationDate":"{\\"iv\\":\\"en9XKkmIub2ROGCc6RX9gg==\\",\\"v\\":1,\\"iter\\":1000,\\"ks\\":128,\\"ts\\":64,\\"mode\\":\\"ccm\\",\\"adata\\":\\"\\",\\"cipher\\":\\"aes\\",\\"salt\\":\\"Go+BZ2BlBbA=\\",\\"ct\\":\\"nZGqAHCtszEpX27WWL3trpJp1qzFnudGefSgnPXkMZ+xdQ==\\"}","version":"v0.3-0","poll":"NLI7U2QEOE","id":"0"}]}}'
    ];
  });

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    pollTitleEqual(assert, 'poll (makeAPoll, freeText) created with v0.3.0');
    pollDescriptionEqual(assert, 'poll type: makeAPoll\nanswer type: freeText\ncreated with v0.3.0');
   
    pollHasOptions(assert, ['Option 1', 'Option 2']);
    
    pollHasUsersCount(assert, 1);
    pollHasUser(assert, 'Georg Elser', ['Answer I', 'Answer II']);
  });
});
