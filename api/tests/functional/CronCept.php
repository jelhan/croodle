<?php
$pollTemplate = array(
  "anonymousUser" => "{\"iv\":\"SOqei2Y7QZt1PFR6IXR4qg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"WAg0oSjCiMAO+JqzIg==\"}",
  "answers" => "{\"iv\":\"WRdAwEa0DF+E83ginLYtPw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"Oaer31ct2PXkmXkzJ1EXRPM3LMf6vGfzMZqjODwey4f7EhqSCUhYov+N7AZKCAAXYVS4WR84kKizxXBK2PQBSFrlB3Bll74ED9ZzRJSJD00otMG9BbgUR90aFws+1jMBP5vpti9+POsii85zLbDPkNg\/Th\/C4Ufv5YWwg\/4ZV0bFMyOgfdjtOWaG5YAMTGUIkz9U9+VCesYJQaTb497qTD\/Wmtz8J\/2pUxdL5\/b5xkdh2DJ4\/N5q0Kz\/CEbaoKwbexnQDlSr3ldlIhs7UmBjC9gkpgG2l9fu6a0VZFBE8hvzYrw=\"}",
  "answerType" => "{\"iv\":\"z1V+GmSWJxSng0bXxnYNRA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ZDf5sBxR6rO+DdO\/yFmk\"}",
  "creationDate" => "{\"iv\":\"DBKid4Yiyr61GVLigJj20w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ORRPzySTa6vt7GQrJOGBvNZXXq4p\/ANinfanE\/51DbcDNw==\"}",
  "description" => "{\"iv\":\"aohDHKaO7c7Fl5vIueBkcA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"+ygmsnYAsEBLZRUV\"}",
  "expirationDate" => "{\"iv\":\"Y0O4n9+Tj+4LSmLoFTaNow==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"jCz8DFIS5eLI4tsjfpr+F4lG+F27BItHPdj85o5+gaDayA==\"}",
  "forceAnswer" => "{\"iv\":\"P5Dg5Y9fS7EFxvqzP8u20A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"90G4jQ1PbalZyyzz\"}",
  "isDateTime" => "{\"iv\":\"3y9OmTJDG0mLqU5zLoZwgQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"yyGaGitGrunDSpsRpw==\"}",
  "options" => "{\"iv\":\"79HYzanMnjtgvBMowUWHaA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"HuFz0AFCpupdmXYdCcAX4OiwpMs\/Jm5XK\/thQW0phxKd0OxKt9NZ3FE\/rMAiYVqRKBqFp+KLhBnbs9ewTFW0Xrvw6paTnvpY9Ftcz1MB\"}",
  "pollType" => "{\"iv\":\"suOomfYe6kKBxjln091tCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"7iDQ2y571OBiJNxdaUY0PjqlgQ==\"}",
  "timezone" => "{\"iv\":\"l0VeY3CPUvMtoDPrw7+iCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"qBlHlZ0nLd3mqA==\"}",
  "title" => "{\"iv\":\"szAOrvhM+bODnldJJP0pGw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"KwMkE7bneP0MX6hQEnM=\"}",
  "version" => "v0.3.0+0ae62f31"
);
// ISO 8601 format in ECMAScript new Date().toISOString() format
// DateTime object must be in UTC timezone
$jsISO8601Format = 'Y-m-d\TH:i:s.00\Z';
$date = (new DateTime())->setTimezone(new DateTimeZone('UTC'));
$polls = [
  // expired
  "expired000" => array_merge($pollTemplate, array(
    "serverExpirationDate" => (clone $date)->sub(new DateInterval('P1D'))->format($jsISO8601Format)
  )),
  // not expired
  "notExpired" => array_merge($pollTemplate, array(
    "serverExpirationDate" => (clone $date)->add(new DateInterval('P1D'))->format($jsISO8601Format)
  ))
];
$dataDir = 'tests/_tmp/data/';
foreach ($polls as $id => $data) {
  mkdir($dataDir . $id);
  file_put_contents($dataDir . $id . '/poll_data', json_encode($data));
}

$I = new FunctionalTester($scenario);
$I->wantTo('run cron and see expired polls being deleted');
$I->runShellCommand('php cron.php tests/_tmp/data/');
\PHPUnit_Framework_Assert::assertFalse(
  is_dir($dataDir . 'expired000'),
  'expired poll got deleted'
);
\PHPUnit_Framework_Assert::assertTrue(
  is_dir($dataDir . 'notExpired'),
  'not yet expired poll is still there'
);
