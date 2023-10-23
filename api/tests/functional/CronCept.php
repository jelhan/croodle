<?php
$pollTemplate = array(
  "anonymousUser" => "{\"iv\":\"SOqei2Y7QZt1PFR6IXR4qg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"WAg0oSjCiMAO+JqzIg==\"}",
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
$polls = [
  // expired
  "expired000" => array_merge($pollTemplate, array(
    "serverExpirationDate" => (new DateTime())->setTimezone(new DateTimeZone('UTC'))->sub(new DateInterval('P1D'))->format($jsISO8601Format)
  )),
  // not expired
  "notExpired" => array_merge($pollTemplate, array(
    "serverExpirationDate" => (new DateTime())->setTimezone(new DateTimeZone('UTC'))->add(new DateInterval('P1D'))->format($jsISO8601Format)
  ))
];
foreach ($polls as $id => $data) {
  mkdir(TEST_DATA_DIR . $id);
  file_put_contents(TEST_DATA_DIR . $id . '/poll_data', json_encode($data));
}

$I = new FunctionalTester($scenario);
$I->wantTo('run cron and see expired polls being deleted');
$I->runShellCommand('php cron.php tests/_tmp/data/');
\PHPUnit_Framework_Assert::assertFalse(
  is_dir(TEST_DATA_DIR . 'expired000'),
  'expired poll got deleted'
);
\PHPUnit_Framework_Assert::assertTrue(
  is_dir(TEST_DATA_DIR . 'notExpired'),
  'not yet expired poll is still there'
);
