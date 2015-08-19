<?php
$pollId = "abcDEF0123";
$pollData = [
  "poll" => [
    "encryptedTitle" => "{\"iv\":\"FUekCOJ/UOf91y9etFuh9w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"q8Iy+2AOwjcWjob1uLw=\"}",
    "encryptedDescription" => null,
    "encryptedPollType" => "{\"iv\":\"3iCPGIdKeMFbebcuJlmuMA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"0HDBwqya/9M7Ya/Y60R34uGGlw==\"}",
    "encryptedAnswerType" => "{\"iv\":\"re8c+PWzoZndx8IxQ+JZfA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"qKY/EzZQbGqvkpABchEy\"}",
    "encryptedAnswers" => "{\"iv\":\"Ln9SCj+dvBzTR8hOgoPP0g==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"lVu2owiRla6/R/lZB4SeJT3iNWcb8DqsBehaSxuROdpp6t1MIJX+TuMdiOae2jp36tsCTG2BWeEnoclbPA7ddDuWpxDA6zyM4OM+svJdYt6A3FkKPSUq8uWCJXmomkPmu9t9Cx4gWxDaluYGLGjU2BNIhm2ICTnxq94WkZsEjmM6qtUW3xmRPV+xkszOby5S4dxGZuK49TEfepWqBH6VLt4sDX3NoaU3Pyo6cyQQTLjlQ6nIIvKMrdx4Uk5/03oVTupFq+XsSNCI3fJ35YmPlc8v7qRhflXzDTr2pTOXmuP5w4I=\"}",
    "encryptedOptions" => "{\"iv\":\"GDp5DyeuXMj2nLIiPXRa7w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"yxHxXBvZ9DDMVY+9fNIr6qM6gaMNHXkffxkk87a1Q9rWh0E8O0AVJpl9RYdv3/QkfYRqwjyQqA==\"}",
    "encryptedCreationDate" => "{\"iv\":\"grXGp40HmdMlYd8mpRJb2A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"y9gx6YaU9f6UA/RMD+2ptWXeNQ9HdPt+nkH1bwrM1J85WA==\"}",
    "encryptedForceAnswer" => "{\"iv\":\"cPQxZDytHCCBzyyGB7Zhew==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"U+Xd8Wua3XPDvbPe\"}",
    "encryptedAnonymousUser" => "{\"iv\":\"Rv75z29GDIbZ/RGRs+uq0Q==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"/7sj+sLWPYOWJgvslg==\"}",
    "encryptedIsDateTime" => "{\"iv\":\"noz0JF1Uzv74e27gMu55Kw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"Igefluift7+Wedo1Cw==\"}",
    "encryptedTimezone" => "{\"iv\":\"/sBs7oP15FsJ7qSUSHvewA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"3GQYS4Ils60=\",\"ct\":\"TqJBGIjSGIcVsQ==\"}",
    "encryptedExpirationDate" => "{\"iv\":\"Jmclqi7ZDjKZ1O9t6HgkyQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"CnrCEy2AX1c=\",\"ct\":\"jg0bpNknoJcB4CAumtSEjyRNy845vzbfM6QQeNx0M60ZAw==\"}",
    "serverExpirationDate" => "2015-11-01T17:57:03.713Z",
    "version" => "v0.3.0+d26cd827"
  ]
];
mkdir('tests/_tmp/data/' . $pollId);
file_put_contents('tests/_tmp/data/' . $pollId . '/poll_data', json_encode($pollData));

$I = new ApiTester($scenario);
$I->wantTo('get an existing poll');
$I->sendGET('/polls/' . $pollId);
$I->seeResponseCodeIs(200);
$I->seeResponseIsJson();

unset($pollData["poll"]["serverExpirationDate"]);
$I->seeResponseContainsJson($pollData);

$I->seeResponseContainsJson(["poll" => ["id" => $pollId]]);

$I->dontSeeResponseJsonMatchesJsonPath('poll.serverExpirationDate');
