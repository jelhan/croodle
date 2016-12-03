<?php
/*
 * RESTful API used by ember data for data storage
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require_once 'classes/poll.php';
require_once 'classes/user.php';
require_once 'utils/get-config.php';

$config = getConfig();
if (php_sapi_name() == 'cli-server') {
  // assume that cli-server is only used for testing
  define('DATA_FOLDER', 'tests/_tmp/data/');
}
else {
  define('DATA_FOLDER', $config['dataDir']);
}

function pollIdIsValid($pollId) {
  return preg_match('/[^A-Za-z0-9]/', $pollId) === 0;
}

$app = new \Slim\App(array(
  'debug' => $config['debug']
));

// add expires header to all responses to
// prevent Internet Explorer from caching AJAX requests
$app->add(function (Request $request, Response $response, $next) {
  $response = $response->withHeader('Expires', '-1');
  return $next($request, $response);
});

/*
 * api endpoints
 */
$app->get('/polls/{id}', function (Request $request, Response $response) {
  $pollId = $request->getAttribute('id');
  $poll = Poll::restore($pollId);

  if (!$poll) {
    return $response->withStatus(404);
  }

  return $response->withJSON(
    array(
      'poll' => $poll->export()
    )
  );
});

$app->post('/polls', function (Request $request, Response $response) {
  $poll = Poll::create(
    json_decode(
      $request->getBody()
    )->poll
  );
  $poll->save();

  return $response->withJSON(
    array(
      'poll' => $poll->export()
    )
  );
});

$app->post('/users', function (Request $request, Response $response) {
  $user = User::create(
    json_decode(
      $request->getBody()
    )->user
  );
  $user->save();

  return $response->withJSON(
    array(
      'user' => $user->export()
    )
  );
});

/*
 * error handling
 */
$c = $app->getContainer();
$c['errorHandler'] = function ($c) {
    return function (Request $request, Response $response, $exception) use ($c) {
        return $c['response']->withStatus(500);
    };
};
$c['notFoundHandler'] = function ($c) {
    return function (Request $request, Response $response) use ($c) {
        return $c['response']->withStatus(404);
    };
};

$app->run();
