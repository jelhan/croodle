<?php
/*
 * RESTful API used by ember data for data storage
 */

if (php_sapi_name() == 'cli-server') {
  // assume that cli-server is only used for testing
  define('DATA_FOLDER', 'tests/_tmp/data/');
}
else {
  define('DATA_FOLDER', '../data/');
}

require 'vendor/autoload.php';
require_once 'classes/poll.php';
require_once 'classes/user.php';

function pollIdIsValid($pollId) {
  return preg_match('/[^A-Za-z0-9]/', $pollId) === 0;
}

$app = new \Slim\Slim(array(
  'debug' => false
));

/*
 * default response headers
 */
$app->response->headers->set('Content-Type', 'application/json; charset=utf-8');
// prevent Internet Explorer from caching AJAX requests
$app->expires('-1');

/*
 * api endpoints
 */
$app->get('/polls/:id', function ($pollId) use ($app) {
  $poll = Poll::restore($pollId);

  if (!$poll) {
    $app->halt(404);
  }
  
  $app->response->setBody(
    json_encode(
      array(
        'poll' => $poll->export()
      )
    )
  );
});

$app->post('/polls', function() use ($app) {
  $poll = Poll::create(
    json_decode(
      $app->request->getBody()
    )->poll
  );
  $poll->save();
  
  $app->response->setBody(
    json_encode(
      array(
        'poll' => $poll->export()
      )
    )
  );
});

$app->post('/users', function() use ($app) {
  $user = User::create(
    json_decode(
      $app->request->getBody()
    )->user
  );
  $user->save();

  $app->response->setBody(
    json_encode(
      array(
        'user' => $user->export()
      )
    )
  );
});

/*
 * error handling
 */
$app->error(function() use ($app) {
  $app->halt(500);
});

$app->notFound(function() use ($app) {
  $app->halt(404);
});

$app->run();
