import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class CreateOptionsController extends Controller {
  @service router;

  @action
  nextPage() {
    const { isFindADate } = this.model;

    if (isFindADate) {
      this.router.transitionTo("create.options-datetime");
    } else {
      this.router.transitionTo("create.settings");
    }
  }

  @action
  previousPage() {
    this.router.transitionTo("create.meta");
  }

  @action
  updateOptions(newOptions) {
    this.model.options = newOptions.map(({ value }) =>
      this.store.createFragment("option", { title: value })
    );
  }
}
