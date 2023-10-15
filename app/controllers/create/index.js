import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class CreateIndex extends Controller {
  @service router;

  @action
  submit() {
    this.router.transitionTo("create.meta");
  }

  @action
  handleTransition(transition) {
    if (transition.from?.name === "create.index") {
      const { poll, formData } = this.model;

      poll.pollType = formData.pollType;
    }
  }

  constructor() {
    super(...arguments);

    this.router.on("routeWillChange", this.handleTransition);
  }
}
