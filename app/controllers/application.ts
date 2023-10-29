import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';

export default class ApplicationController extends Controller {
  @service declare flashMessages: FlashMessagesService;
}
