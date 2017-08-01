import Ember from 'ember';

const { run } = Ember;

export default function destroyApp(application) {
  // this is required to fix "second Pretender instance" warnings
  if (server) {
    server.shutdown();
  }

  run(application, 'destroy');
}
