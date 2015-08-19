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
require 'classes/datahandler.php';

function pollIdIsValid($pollId) {
  return preg_match('/[^A-Za-z0-9]/', $pollId) === 0;
}

$app = new \Slim\Slim();

/*
 * default response headers
 */
$app->response->headers->set('Content-Type', 'application/json; charset=utf-8');
// prevent Internet Explorer from caching AJAX requests
$app->expires('-1');

$app->get('/polls/:id', function ($pollId) use ($app) {
  if(!pollIdIsValid($pollId)) {
    $app->halt(400, 'requested id must only contain letters and numbers');
  }

  $datahandler = new Datahandler();
  $data = $datahandler->get($pollId);

  if ($data === false) {
    // there was no data with this id or it could not be readen
    $app->response->setStatus(404);
  }
  else {
    $app->response->setBody($data);
  }
});

$app->post('/polls', function() use ($app) {
  $datahandler = new Datahandler();
  $pollCreatedId = $datahandler->writePoll(
    $app->request->getBody()
  );

  if (!$pollCreatedId) {
    $app->halt(500, 'saving poll failed');
  }
  
  $app->response->setBody(
    $datahandler->get($pollCreatedId)
  );
});

$app->post('/users', function() use ($app) {
  $datahandler = new Datahandler();

  // get poll id
  $dataObject = json_decode(
    $app->request->getBody()
  );
  $pollId = $dataObject->user->poll;
  if (!pollIdIsValid($pollId)) {
    $app->halt(400, 'poll id must only contain letters and numbers');
  }

  // write user
  $userCreatedId = $datahandler->writeUser($pollId, $app->request->getBody());

  if ($userCreatedId === false) {
    $app->halt(500, 'saving user failed');
  }

  // add user id to user object
  $dataObject->user->id = $pollId . '_' . $userCreatedId;
  
  $app->response->setBody(
    json_encode($dataObject)
  );
});

$app->notFound(function () use ($app) {
	// die("verdammte schieße...");
	$app->halt(404, "verdammte scheiße\n" . $app->request->getResourceUri() . "\n");
});

$app->run();
