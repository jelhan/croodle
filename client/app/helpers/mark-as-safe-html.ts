import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

type Positional = [html: string];

export interface MarkAsSafeHtmlHelperSignature {
  Args: {
    Positional: Positional;
  };
}

const markAsSafeHtml = helper<MarkAsSafeHtmlHelperSignature>(([html]) => {
  return htmlSafe(html);
});

export default markAsSafeHtml;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'mark-as-safe-html': typeof markAsSafeHtml;
  }
}
