import 'ember-source/types';
import '@glint/environment-ember-loose';
import type EmberIntlRegistry from 'ember-intl/template-registry';
import type EmberMathRegistry from 'ember-math-helpers/template-registry';
import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberIntlRegistry,
      EmberMathRegistry,
      EmberTruthRegistry {}
}
