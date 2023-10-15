import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import Controller from "@ember/controller";

export default class CreateMetaController extends Controller {
  @service router;

  @action
  previousPage() {
    this.router.transitionTo("create.index");
  }

  @action
  submit() {
    this.router.transitionTo("create.options");
  }

  @action
  handleTransition(transition) {
    if (transition.from?.name === "create.meta") {
      const { poll, formData } = this.model;

      poll.title = formData.title;
      poll.description = formData.description;
    }
  }

  constructor() {
    super(...arguments);

    this.router.on("routeWillChange", this.handleTransition);
  }
}
