import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig(({ mode }) => ({
  plugins: [
    classicEmberSupport(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
  html: {
    // ember-qunit loads CSS in a way requiring unsafe-inline or nonce.
    // The nonce must not be part of the production build as that would be
    // a security issue.
    cspNonce:
      mode === 'development'
        ? 'must-not-be-present-in-production-builds'
        : undefined,
  },
}));
