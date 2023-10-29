import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

type Positional = [html: string];

export interface MarkAsSafeHtmlHelperSignature {
  Args: {
    Positional: Positional;
  };
}

export default helper<MarkAsSafeHtmlHelperSignature>(function markAsSafeHtml([
  html,
]) {
  return htmlSafe(html);
});
