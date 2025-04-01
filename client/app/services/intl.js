import BaseIntlService from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';

export default class IntlService extends BaseIntlService {
  // Workaround for https://github.com/ember-intl/ember-intl/issues/1789
  @tracked _locale = 'en';
}
