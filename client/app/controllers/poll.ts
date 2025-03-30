import Controller from '@ember/controller';
import type { PollRouteModel } from 'croodle/routes/poll';

export default class PollController extends Controller {
  declare model: PollRouteModel;

  queryParams = ['encryptionKey'];
  encryptionKey = '';
}
