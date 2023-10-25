<?php

$pollJson = <<<EOD
{
  "poll": {
    "title": "{\"iv\":\"szAOrvhM+bODnldJJP0pGw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"KwMkE7bneP0MX6hQEnM=\"}",
    "description": "{\"iv\":\"aohDHKaO7c7Fl5vIueBkcA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"+ygmsnYAsEBLZRUV\"}",
    "pollType": "{\"iv\":\"suOomfYe6kKBxjln091tCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"7iDQ2y571OBiJNxdaUY0PjqlgQ==\"}",
    "answerType": "{\"iv\":\"z1V+GmSWJxSng0bXxnYNRA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ZDf5sBxR6rO+DdO/yFmk\"}",
    "options": "{\"iv\":\"79HYzanMnjtgvBMowUWHaA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"HuFz0AFCpupdmXYdCcAX4OiwpMs/Jm5XK/thQW0phxKd0OxKt9NZ3FE/rMAiYVqRKBqFp+KLhBnbs9ewTFW0Xrvw6paTnvpY9Ftcz1MB\"}",
    "creationDate": "{\"iv\":\"DBKid4Yiyr61GVLigJj20w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ORRPzySTa6vt7GQrJOGBvNZXXq4p/ANinfanE/51DbcDNw==\"}",
    "forceAnswer": "{\"iv\":\"P5Dg5Y9fS7EFxvqzP8u20A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"90G4jQ1PbalZyyzz\"}",
    "anonymousUser": "{\"iv\":\"SOqei2Y7QZt1PFR6IXR4qg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"WAg0oSjCiMAO+JqzIg==\"}",
    "timezone": "{\"iv\":\"l0VeY3CPUvMtoDPrw7+iCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"qBlHlZ0nLd3mqA==\"}",
    "expirationDate": "{\"iv\":\"Y0O4n9+Tj+4LSmLoFTaNow==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"jCz8DFIS5eLI4tsjfpr+F4lG+F27BItHPdj85o5+gaDayA==\"}",
    "serverExpirationDate": "2015-11-22T22:05:15.065Z",
    "version": "v0.3.0+0ae62f31"
  }
}
EOD;

$I = new ApiTester($scenario);
$I->wantTo('create a poll');
$I->sendPOST('/polls', $pollJson);
$I->seeResponseCodeIs(200);
$I->seeHttpHeader('Content-Type', 'application/json');
$I->seeHttpHeader('Expires', '-1');
$I->seeResponseIsJson();
$I->seeResponseJsonMatchesJsonPath('poll.id');
$pollId = $I->grabDataFromResponseByJsonPath('poll.id')[0];
\PHPUnit_Framework_Assert::assertNotRegExp(
  '/[^A-Za-z0-9]/',
  $pollId,
  'poll id only consists of numbers and letters'
);
\PHPUnit_Framework_Assert::assertTrue(
  strlen($pollId) === 10,
  'poll id has 10 characters'
);
$I->seeResponseJsonMatchesJsonPath('poll.users');
$users = $I->grabDataFromResponseByJsonPath('poll.users')[0];
\PHPUnit_Framework_Assert::assertTrue(
  is_array($users),
  'user should be an array'
);
\PHPUnit_Framework_Assert::assertEquals(
  count($users),
  0,
  'user array should be empty'
);

$pollData = json_decode($pollJson, true);
unset($pollData["poll"]["serverExpirationDate"]);
$I->seeResponseContainsJson(
  $pollData,
  'all data except serverExpirationDate is in response'
);
$I->dontSeeResponseJsonMatchesJsonPath(
  'poll.serverExpirationDate',
  'serverExpirationDate is not in response payload.'
);
