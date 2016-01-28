export default function(requestBody, id) {
  if (id === null) {
    id = 1;
  }

  let poll = JSON.parse(requestBody);
  poll.user.id = id;
  return [
    200,
    { 'Content-Type': 'application/json' },
    JSON.stringify(poll)
  ];
}
