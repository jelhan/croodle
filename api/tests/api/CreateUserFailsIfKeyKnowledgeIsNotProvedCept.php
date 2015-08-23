<?php

$keyKnowledge = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
$wrongKeyKnowledge = 'thisisawrongproofkeyknowledge00000000000000000000000000000000000';
$pollId = substr(md5(__FILE__), 0, 10);
$pollJson = '{"anonymousUser":"{\"iv\":\"SOqei2Y7QZt1PFR6IXR4qg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"WAg0oSjCiMAO+JqzIg==\"}","answers":"{\"iv\":\"WRdAwEa0DF+E83ginLYtPw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"Oaer31ct2PXkmXkzJ1EXRPM3LMf6vGfzMZqjODwey4f7EhqSCUhYov+N7AZKCAAXYVS4WR84kKizxXBK2PQBSFrlB3Bll74ED9ZzRJSJD00otMG9BbgUR90aFws+1jMBP5vpti9+POsii85zLbDPkNg\/Th\/C4Ufv5YWwg\/4ZV0bFMyOgfdjtOWaG5YAMTGUIkz9U9+VCesYJQaTb497qTD\/Wmtz8J\/2pUxdL5\/b5xkdh2DJ4\/N5q0Kz\/CEbaoKwbexnQDlSr3ldlIhs7UmBjC9gkpgG2l9fu6a0VZFBE8hvzYrw=\"}","answerType":"{\"iv\":\"z1V+GmSWJxSng0bXxnYNRA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ZDf5sBxR6rO+DdO\/yFmk\"}","creationDate":"{\"iv\":\"DBKid4Yiyr61GVLigJj20w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"ORRPzySTa6vt7GQrJOGBvNZXXq4p\/ANinfanE\/51DbcDNw==\"}","description":"{\"iv\":\"aohDHKaO7c7Fl5vIueBkcA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"+ygmsnYAsEBLZRUV\"}","expirationDate":"{\"iv\":\"Y0O4n9+Tj+4LSmLoFTaNow==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"jCz8DFIS5eLI4tsjfpr+F4lG+F27BItHPdj85o5+gaDayA==\"}","forceAnswer":"{\"iv\":\"P5Dg5Y9fS7EFxvqzP8u20A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"90G4jQ1PbalZyyzz\"}","isDateTime":"{\"iv\":\"3y9OmTJDG0mLqU5zLoZwgQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"yyGaGitGrunDSpsRpw==\"}","options":"{\"iv\":\"79HYzanMnjtgvBMowUWHaA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"HuFz0AFCpupdmXYdCcAX4OiwpMs\/Jm5XK\/thQW0phxKd0OxKt9NZ3FE\/rMAiYVqRKBqFp+KLhBnbs9ewTFW0Xrvw6paTnvpY9Ftcz1MB\"}","pollType":"{\"iv\":\"suOomfYe6kKBxjln091tCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"7iDQ2y571OBiJNxdaUY0PjqlgQ==\"}","timezone":"{\"iv\":\"l0VeY3CPUvMtoDPrw7+iCw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"qBlHlZ0nLd3mqA==\"}","title":"{\"iv\":\"szAOrvhM+bODnldJJP0pGw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3gtpUTAyVK4=\",\"ct\":\"KwMkE7bneP0MX6hQEnM=\"}","version":"v0.3.0+0ae62f31","serverExpirationDate":"2015-11-22T22:05:15.065Z"}';
$userJson = '{"user":{"name":"{\"iv\":\"kizIqK7FPNmRuQB7VHsMOw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"UsYMzrww3HKR8vl2TKVE\"}","selections":"{\"iv\":\"hRmiZagEhQVhw2cg6UJNrg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"2zIPGpiSC6wJHRoAMYBFPXx3qmlZg0Z/Jt/15mY+sHPLCqoAn97TKGN6KIvl/5gmgCFqLQFNo6uppCTUhljoV5y2kMtGvm0g3+NdpcejWGOeMACDPcp1mpXII87ZTfC6WrtxcWCB6UGYN8EynOdndFTGp+WVZnXCCya7YPThk/QRwoHoPWS6+TJFT9WeHV4i4kUIg2K3kdz3Op7S/c7l7KbOc8GsyjZzv0bRDnAm68/+FlJyZnvfMfU8vTxExsIsd0pBy4JBV4hg9SlCPectb5BAvBCULLDPA08prf262RUmVKJ+M3P1+5KkBQcnQwnUW/fzAQ7lqA==\"}","creationDate":"{\"iv\":\"xqdDY/A7MHLeAsoU9S/j+A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"TQOhbjveZbvdiyYpxfwNyu5pi1PLia9FApJJRmr3QoyrWA==\"}","version":"v0.3.0+0ae62f31","poll":"' . $pollId . '"}}';

$pollDir = TEST_DATA_DIR . $pollId . '/';
$usersDir = $pollDir . 'users/';
mkdir($pollDir);
file_put_contents($pollDir . 'key_knowledge', $keyKnowledge);

$I = new ApiTester($scenario);
$I->wantTo('see that create a new user fails if key knowledge is wrong');
$I->haveHTTPHeader('X-Croodle-Proof-Key-Knowledge', $wrongKeyKnowledge);
$I->sendPOST('/users', $userJson);
$I->seeResponseCodeIs(500);
$I->seeResponseEquals('');

try {
  $result = file_get_contents($usersDir . '0');
}
catch (Exception $e) {
  $result = false;
}
\PHPUnit_Framework_Assert::assertFalse(
  $result,
  'no user is saved to disc'
);
