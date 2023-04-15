import Route from '@ember/routing/route';

export default class PollRoute extends Route {
  model({ poll_id: pollId }: { poll_id: string }) {
    console.log(`Should load poll with ID ${pollId}`);
  }
}
