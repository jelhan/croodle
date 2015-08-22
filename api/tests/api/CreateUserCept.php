<?php

$pollId = 'qwerQWER12';
$userJson = '{"user":{"name":"{\"iv\":\"kizIqK7FPNmRuQB7VHsMOw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"UsYMzrww3HKR8vl2TKVE\"}","selections":"{\"iv\":\"hRmiZagEhQVhw2cg6UJNrg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"2zIPGpiSC6wJHRoAMYBFPXx3qmlZg0Z/Jt/15mY+sHPLCqoAn97TKGN6KIvl/5gmgCFqLQFNo6uppCTUhljoV5y2kMtGvm0g3+NdpcejWGOeMACDPcp1mpXII87ZTfC6WrtxcWCB6UGYN8EynOdndFTGp+WVZnXCCya7YPThk/QRwoHoPWS6+TJFT9WeHV4i4kUIg2K3kdz3Op7S/c7l7KbOc8GsyjZzv0bRDnAm68/+FlJyZnvfMfU8vTxExsIsd0pBy4JBV4hg9SlCPectb5BAvBCULLDPA08prf262RUmVKJ+M3P1+5KkBQcnQwnUW/fzAQ7lqA==\"}","creationDate":"{\"iv\":\"xqdDY/A7MHLeAsoU9S/j+A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"TQOhbjveZbvdiyYpxfwNyu5pi1PLia9FApJJRmr3QoyrWA==\"}","version":"v0.3.0+0ae62f31","poll":"' . $pollId . '"}}';

$pollDir = TEST_DATA_DIR . $pollId . '/';
$usersDir = $pollDir . 'users/';
mkdir($pollDir);

$I = new ApiTester($scenario);
$I->wantTo('create a user');
$I->sendPOST('/users', $userJson);
$I->seeResponseCodeIs(200);
$I->seeResponseIsJson();
$I->seeResponseJsonMatchesJsonPath('user.id');
$userId = $I->grabDataFromResponseByJsonPath('user.id')[0];
\PHPUnit_Framework_Assert::assertEquals(
  count(explode('_', $userId)),
  2,
  'user id has two parts seperated by _'
);
\PHPUnit_Framework_Assert::assertEquals(
  explode('_', $userId)[0],
  $pollId,
  'user id starts by poll id'
);
\PHPUnit_Framework_Assert::assertEquals(
  (int) explode('_', $userId)[1],
  explode('_', $userId)[1],
  'second part contains numbers'
);

$userData = json_decode($userJson, true);
foreach($userData["user"] as $key => $value) {
  $I->seeResponseContainsJson(["user" => [$key => $value]]);
}
