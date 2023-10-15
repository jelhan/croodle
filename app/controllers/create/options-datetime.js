import classic from "ember-classic-decorator";
import { action } from "@ember/object";
import { alias } from "@ember/object/computed";
import Controller from "@ember/controller";
import { DateTime } from 'luxon';
import { inject as service } from '@ember/service';

@classic
export default class CreateOptionsDatetimeController extends Controller {
  @service router;

  @action
  nextPage() {
    this.router.transitionTo("create.settings");
  }

  @action
  previousPage() {
    this.router.transitionTo("create.options");
  }

  @action
  updateOptions(options) {
    this.model.options = options
      .map(({ day, time }) => time ? DateTime.fromISO(`${day}T${time}`).toISO() : day)
      .sort()
      .map((isoString) => {
        return this.store.createFragment("option", { title: isoString });
      });
  }

  @alias("model.options")
  options;
}
