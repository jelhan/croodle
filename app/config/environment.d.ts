/**
 * Type declarations for
 *    import config from 'croodle/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none';
  rootURL: string;
  APP: {
    version: string;
  };
};

export default config;
