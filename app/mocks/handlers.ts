import { rest } from 'msw';
import { Poll, polls } from './db';

export const createPollHandler = rest.post('/polls', async (req, res, ctx) => {
  const document = await req.json();
  const poll = new Poll(document['bulk:data'][0]);

  for (const optionResourceObject of document['bulk:included']) {
    poll.addOption(optionResourceObject);
  }

  polls.set(poll.id, poll);

  return res(ctx.status(204));
});

export const getPollHandler = rest.get('/polls/:pollId', (req, res, ctx) => {
  const { pollId } = req.params;

  if (typeof pollId !== 'string') {
    throw new Error(`${pollId} is not a valid ID for a poll`);
  }

  const poll = polls.get(pollId);
  if (!poll) {
    return res(ctx.status(404));
  }

  const document = {
    data: {
      id: poll.id,
      type: 'polls',
      attributes: poll.attributes,
      relationships: {
        options: {
          data: poll.options.map((option) => {
            return {
              id: option.id,
              type: 'options',
            };
          }),
        },
      },
    },
    included: [
      poll.options.map((option) => {
        return {
          id: option.id,
          attributes: option.attributes,
        };
      }),
    ],
  };

  return res(ctx.status(200), ctx.json(document), ctx.delay());
});

export default [createPollHandler, getPollHandler];
