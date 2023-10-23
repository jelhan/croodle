<?php

$pollId = substr(md5(__FILE__), 0, 10);
$pollJson = <<<EOD
{
  "anonymousUser": "{\"iv\":\"gVHZSXyMm10Fn+kDooa7uw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"GJsQQYA7TdAa+v3Rvg==\"}",
  "answerType": "{\"iv\":\"ILkAzgUfAGNUtLr7CbEJEQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"nMOp+QApQGgP9dwefNpi\"}",
  "creationDate": "{\"iv\":\"6tWbieK03uXUR+E0AMbs0A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"YkkLVBkFyx4xFldZ7qnDESG0teHJmXaPMUB05p9L0xUIMg==\"}",
  "description": "{\"iv\":\"fWvHh47So4WBNfEHXrwLiA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"5W7nauOakSoFD52V\"}",
  "expirationDate": "{\"iv\":\"HRsMvEQaoCp8QdqBGHevnA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"LXYamNRDyhIY5xY+CLqI4GHbocc9NoHQtePKU9fHpJn9zg==\"}",
  "forceAnswer": "{\"iv\":\"bh4iZ4pKe0GnXcM764702g==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"q5VBynWGotXRrc2P\"}",
  "isDateTime": "{\"iv\":\"mlDCtvsJZaDlZD9kqfJHuA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"53g42C6Am+0s25/DsA==\"}",
  "options": "{\"iv\":\"ZneP/x45NGh/DC26GI4kvg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"4MvV9SNQq2dB6b/MdX47R0KaRSfyZOZMEVUFDv7G3/EcDBv7Z0pgSU9JXoF8BoSOz40rYrRtTw==\"}",
  "pollType": "{\"iv\":\"j3P6eN0ZmNMMxLTAVD6gjQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"opwiZHAQi+I8R5HDxLfLK59DcQ==\"}",
  "timezone": "{\"iv\":\"HKkSqcJONggGT9QQ+jZdUg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"BANN8sJlk8JK9A==\"}",
  "title": "{\"iv\":\"4DX7dAJt7JIBHaR1V0Ct8A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"f1VUZf69nB94TF3/HA==\"}",
  "version": "v0.3.0+0ae62f31",
  "serverExpirationDate": "2015-11-22T20:35:03.764Z"
}
EOD;
$userJson = <<<EOD
{
  "user": {
    "name": "{\"iv\":\"kizIqK7FPNmRuQB7VHsMOw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"UsYMzrww3HKR8vl2TKVE\"}",
    "selections": "{\"iv\":\"hRmiZagEhQVhw2cg6UJNrg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"2zIPGpiSC6wJHRoAMYBFPXx3qmlZg0Z/Jt/15mY+sHPLCqoAn97TKGN6KIvl/5gmgCFqLQFNo6uppCTUhljoV5y2kMtGvm0g3+NdpcejWGOeMACDPcp1mpXII87ZTfC6WrtxcWCB6UGYN8EynOdndFTGp+WVZnXCCya7YPThk/QRwoHoPWS6+TJFT9WeHV4i4kUIg2K3kdz3Op7S/c7l7KbOc8GsyjZzv0bRDnAm68/+FlJyZnvfMfU8vTxExsIsd0pBy4JBV4hg9SlCPectb5BAvBCULLDPA08prf262RUmVKJ+M3P1+5KkBQcnQwnUW/fzAQ7lqA==\"}",
    "creationDate": "{\"iv\":\"xqdDY/A7MHLeAsoU9S/j+A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"TQOhbjveZbvdiyYpxfwNyu5pi1PLia9FApJJRmr3QoyrWA==\"}",
    "version": "v0.3.0+0ae62f31",
    "poll": "$pollId"
  }
}
EOD;

$pollDir = 'tests/_tmp/data/' . $pollId . '/';
$userDir = $pollDir . 'user/';
mkdir($pollDir);
file_put_contents($pollDir . 'poll_data', $pollJson, LOCK_EX);
mkdir($userDir);
file_put_contents($userDir . '0', '', LOCK_EX);
file_put_contents($userDir . '1', '', LOCK_EX);

$I = new ApiTester($scenario);
$I->wantTo('create a user');
$I->sendPOST('/users', $userJson);
$I->seeResponseCodeIs(200);
$I->seeHttpHeader('Content-Type', 'application/json');
$I->seeHttpHeader('Expires', '-1');
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
  2,
  'second part is two as there are already 2 user (0, 1)'
);

$userData = json_decode($userJson, true);
foreach($userData["user"] as $key => $value) {
  $I->seeResponseContainsJson(["user" => [$key => $value]]);
}
