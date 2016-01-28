export default function(requestBody, id) {
  let poll = JSON.parse(requestBody);
  poll.poll.id = id;
  return [
    200,
    { 'Content-Type': 'application/json' },
    JSON.stringify(poll)
  ];
}
