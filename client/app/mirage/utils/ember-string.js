// The following implementation is taken from @ember/string:
// https://github.com/emberjs/ember-string/blob/16fffa2a565f21c177f9cfa41751ba60b9634863/src/index.ts#L26-L30
// https://github.com/emberjs/ember-string/blob/16fffa2a565f21c177f9cfa41751ba60b9634863/src/index.ts#L91-L95
//
// @ember/string is licensed under MIT:
// https://github.com/emberjs/ember-string/blob/16fffa2a565f21c177f9cfa41751ba60b9634863/LICENSE.md
//
// Code needed to be copied as we couldn't rely on the package directly.
// ember-cli-mirage pulls the application's serializers (and other
// configuration) in the build as if it would be its own code. This triggered
// an error in Webpack's build as ember-cli-mirage is not depending on
// `@ember/string`:
//
// > Module not found: Error: ember-cli-mirage is trying to import the app's
// > @ember/string package, but it seems to be missing

const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
const STRING_DASHERIZE_REGEXP = /[ _]/g;

function decamelize(str) {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

function dasherize(str) {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

export { dasherize };
