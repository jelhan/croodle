import Component from '@glimmer/component';
import { TrackedSet } from 'tracked-built-ins';
import type { CreateRouteModel } from 'croodle/routes/create';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';

export interface CreateNavigationSignature {
  // The arguments accepted by the component
  Args: {
    model: CreateRouteModel;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class CreateNavigation extends Component<CreateNavigationSignature> {
  @service declare router: RouterService;

  constructor(owner: unknown, args: CreateNavigationSignature['Args']) {
    super(owner, args);

    const updateVisitedSteps = () => {
      const { currentRouteName } = this.router;

      // currentRouteName might not be defined in some edge cases
      if (!currentRouteName) {
        return;
      }

      const step = currentRouteName.split('.').pop();
      this.visitedSteps.add(step);
    };

    this.router.on('routeDidChange', updateVisitedSteps);

    registerDestructor(this, () =>
      this.router.off('routeDidChange', updateVisitedSteps),
    );
  }

  visitedSteps = new TrackedSet();

  get canEnterMetaStep() {
    const { visitedSteps } = this;
    const { pollType } = this.args.model;

    return visitedSteps.has('meta') && pollType;
  }

  get canEnterOptionsStep() {
    const { title } = this.args.model;

    return (
      this.visitedSteps.has('options') &&
      typeof title === 'string' &&
      title.length >= 2
    );
  }

  get canEnterOptionsDatetimeStep() {
    return (
      this.visitedSteps.has('options-datetime') &&
      this.args.model.dateOptions.size >= 1
    );
  }

  get canEnterSettingsStep() {
    const { model } = this.args;
    const { visitedSteps } = this;
    const { dateOptions, freetextOptions, pollType } = model;
    const options = pollType === 'FindADate' ? dateOptions : freetextOptions;

    return visitedSteps.has('settings') && options.size >= 1;
  }

  get isFindADate() {
    const { pollType } = this.args.model;

    return pollType === 'FindADate';
  }

  @action
  transitionTo(route: string) {
    this.router.transitionTo(route);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateNavigation: typeof CreateNavigation;
  }
}
