import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SharePollUrlComponent extends Component {
  @service declare router: RouterService;

  @tracked shouldShowCopySuccessMessage = false;

  get pollUrl() {
    // RouterService.currentURL is relative to the webserver's
    // directory from which Croodle is served.
    const relativeUrl = this.router.currentURL;

    // The URL under which Croodle is served, is not known at
    // build-time. But we can construct it ourself, by parsing
    // window.location.href and replacing the hash part.
    const absoluteUrl = new URL(window.location.href);
    absoluteUrl.hash = relativeUrl;

    return absoluteUrl.toString();
  }

  @action
  showCopySuccessMessage() {
    this.shouldShowCopySuccessMessage = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SharePollUrl: typeof SharePollUrlComponent;
  }
}
