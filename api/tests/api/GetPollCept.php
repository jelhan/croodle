<?php

$pollId = substr(md5(__FILE__), 0, 10);
$expirationDate = date("Y-m-dTH:i:s.000Z", strtotime("+3 month"));
$pollJson = <<<EOD
{
  "anonymousUser": "{\"iv\":\"SOqei2Y7QZt1PFR6IXR4qg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"WAg0oSjCiMAO+JqzIg==\"}",
  "answerType": "{\"iv\":\"z1V+GmSWJxSng0bXxnYNRA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ZDf5sBxR6rO+DdO/yFmk\"}",
  "creationDate": "{\"iv\":\"DBKid4Yiyr61GVLigJj20w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ORRPzySTa6vt7GQrJOGBvNZXXq4p/ANinfanE/51DbcDNw==\"}",
  "description": "{\"iv\":\"aohDHKaO7c7Fl5vIueBkcA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"+ygmsnYAsEBLZRUV\"}",
  "expirationDate": "{\"iv\":\"Y0O4n9+Tj+4LSmLoFTaNow==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"jCz8DFIS5eLI4tsjfpr+F4lG+F27BItHPdj85o5+gaDayA==\"}",
  "forceAnswer": "{\"iv\":\"P5Dg5Y9fS7EFxvqzP8u20A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"90G4jQ1PbalZyyzz\"}",
  "options": "{\"iv\":\"79HYzanMnjtgvBMowUWHaA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"HuFz0AFCpupdmXYdCcAX4OiwpMs/Jm5XK/thQW0phxKd0OxKt9NZ3FE/rMAiYVqRKBqFp+KLhBnbs9ewTFW0Xrvw6paTnvpY9Ftcz1MB\"}",
  "pollType": "{\"iv\":\"suOomfYe6kKBxjln091tCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"7iDQ2y571OBiJNxdaUY0PjqlgQ==\"}",
  "timezone": "{\"iv\":\"l0VeY3CPUvMtoDPrw7+iCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"qBlHlZ0nLd3mqA==\"}",
  "title": "{\"iv\":\"szAOrvhM+bODnldJJP0pGw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"KwMkE7bneP0MX6hQEnM=\"}",
  "version": "v0.3.0+0ae62f31",
  "serverExpirationDate": "$expirationDate"
}
EOD;

mkdir('tests/_tmp/data/' . $pollId);
file_put_contents('tests/_tmp/data/' . $pollId . '/poll_data', $pollJson);

$I = new ApiTester($scenario);
$I->wantTo('get an existing poll');
$I->sendGET('/polls/' . $pollId);
$I->seeResponseCodeIs(200);
$I->seeHttpHeader('Content-Type', 'application/json');
$I->seeHttpHeader('Expires', '-1');
$I->seeResponseIsJson();

$pollData = json_decode($pollJson, true);
unset($pollData["serverExpirationDate"]);
$I->seeResponseContainsJson(
  array(
    'poll' => $pollData
  )
);

$I->seeResponseContainsJson(["poll" => ["id" => $pollId]]);
$I->dontSeeResponseJsonMatchesJsonPath('poll.serverExpirationDate');
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
