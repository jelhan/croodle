<?php

$pollId = substr(md5(__FILE__), 0, 10);
$pollJson = '{"anonymousUser":"{\"iv\":\"gVHZSXyMm10Fn+kDooa7uw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"GJsQQYA7TdAa+v3Rvg==\"}","answers":"{\"iv\":\"aK1JcI3viLPIlOO45K+ePA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"Bx4SRcww+hJ46NIiVcWBUZHADADX\/XPsxXMx4XzMQZWqu6M0690D4oTflSRJoqxe0egxdfMOUxuWhmACG\/UYXSYJQjcSg+QTq6KJbaXG+SvsCMZ7iz12a\/uf9lXyiag4IbLldgL4vE3LfZO6oih\/o\/yG4hechjNdSkqUa2IvsRbXWB2aHen6a5Ch5WjqWrr4xRRrukPvf7aumilT2Cf0LswHJ2fwYNilylV0h9oegKYp+qWphm4SL8x2ogRemSCt7u7ByEOwZV0w6D9bz9RvGLTRRLJaLIm\/VlE3k7R6Hz1vyps=\"}","answerType":"{\"iv\":\"ILkAzgUfAGNUtLr7CbEJEQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"nMOp+QApQGgP9dwefNpi\"}","creationDate":"{\"iv\":\"6tWbieK03uXUR+E0AMbs0A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"YkkLVBkFyx4xFldZ7qnDESG0teHJmXaPMUB05p9L0xUIMg==\"}","description":"{\"iv\":\"fWvHh47So4WBNfEHXrwLiA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"5W7nauOakSoFD52V\"}","expirationDate":"{\"iv\":\"HRsMvEQaoCp8QdqBGHevnA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"LXYamNRDyhIY5xY+CLqI4GHbocc9NoHQtePKU9fHpJn9zg==\"}","forceAnswer":"{\"iv\":\"bh4iZ4pKe0GnXcM764702g==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"q5VBynWGotXRrc2P\"}","options":"{\"iv\":\"ZneP\/x45NGh\/DC26GI4kvg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"4MvV9SNQq2dB6b\/MdX47R0KaRSfyZOZMEVUFDv7G3\/EcDBv7Z0pgSU9JXoF8BoSOz40rYrRtTw==\"}","pollType":"{\"iv\":\"j3P6eN0ZmNMMxLTAVD6gjQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"opwiZHAQi+I8R5HDxLfLK59DcQ==\"}","timezone":"{\"iv\":\"HKkSqcJONggGT9QQ+jZdUg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"BANN8sJlk8JK9A==\"}","title":"{\"iv\":\"4DX7dAJt7JIBHaR1V0Ct8A==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"f1VUZf69nB94TF3\/HA==\"}","version":"v0.3.0+0ae62f31","serverExpirationDate":"' . date("Y-m-dTH:i:s.000Z", strtotime("+3 month")) . '"}';
$user1Json = '{"name":"{\"iv\":\"GJXPSYYmTVfEsst31BD92w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"smbuxujRLF/xNS1syTWFguE=\"}","selections":"{\"iv\":\"WXlkCM3pGyD+SyIhccmHYg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"UHs2ArTVTHfS04J3HNvwrV68xFqra0Q0qtVpLZRLPUbqgdXmn960FjEFiLa9Cnk5OcKEQtbOgWJXehHlAJFAWFpdyDE/gcCOKG62c2/hVauroeycQE16wDCjrEwor/FV9HxNjTbYxoJASjCy9ROLdOUhSlFfQfHLcvVpsTgPpnKPr7aYBgODu5XIdRI8Pf5nYF0K96KE9xn+mkg3ZjyXWSk1LBaBDpIOCrcj+8zl7tLtkgPNfh8aNVgQHC5hRrIbL9kZwD4XXEUPImRFITEy2rUWKp8Q0/jAgHCnqSzOLOFS8KrJOktDX++DjK3cB4oT5ttLvcRxRQ==\"}","creationDate":"{\"iv\":\"3/KUsITWzJNWx5fDzYC9Xg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"llgQE2GpZDg1ZKRRlXliGlF09VsrVZ1R57EIQ21+dej5yg==\"}","version":"v0.3.0+0ae62f31","poll":"l3zyFJUWcQ"}';
$user2Json = '{"name":"{\"iv\":\"DVNTCOFfACEOrgtVNVMyww==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"eug7bstOm7T\/CCFs32o=\"}","selections":"{\"iv\":\"ubEuXoXzw4QFuzjAyvXC6w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"PfQ4v4hkBf+S0GX7JmnIp2LO5sh\/jg9nEIPn8NeU2Gn9Rb7cqsjCLgKOQ2xkiIzCyimVBOYg0fjGCyzM\/b6ZPQnY+86teNGogEteD4fjqGHhO832FNOy7Oci0YC8VAM1x9SlQNBI9V+vFc706JbZgwA8JY46UMiGK3HU49pgbYMpdnWEmt4dGzGrLMnNbh4J1Or5JydKmrp4dXaMiiggSXhmUTgBJSRhF7dxQm16oaA1lJpCWoQBvu+WTJv34LnBXHbgg6JcAEEONaQRw1jmMeqo36tQJxSdjiVfcDWzMifWiz\/nhQMqDHkc19iOAmDBo2Rf+yrGWA==\"}","creationDate":"{\"iv\":\"Sj4pVW\/maHa8DUNFHhyUrw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"mhO9ROu+dr4=\",\"ct\":\"HaY9MtEzVmEg3dxtI\/pfaIrsivBJSNeC5l5iJHQrvyYQGA==\"}","version":"v0.3.0+0ae62f31","poll":"l3zyFJUWcQ"}';

$pollDir = 'tests/_tmp/data/' . $pollId . '/';
$userDir = $pollDir . 'user/';
if(!mkdir($pollDir)) {
  throw new Exception('Can not create poll dir');
}
file_put_contents($pollDir . 'poll_data', $pollJson);
if(!mkdir($userDir)) {
  throw new Exception('Can not create user dir');
}
file_put_contents($userDir . '0', $user1Json);
file_put_contents($userDir . '1', $user2Json);

$I = new ApiTester($scenario);
$I->wantTo('get an existing poll');
$I->sendGET('/polls/' . $pollId);
$I->seeResponseCodeIs(200);
$I->seeHttpHeader('Content-Type', 'application/json;charset=utf-8');
$I->seeHttpHeader('Expires', '-1');
$I->seeResponseIsJson();

$pollData = json_decode($pollJson, true);
unset($pollData["serverExpirationDate"]);
foreach($pollData as $key => $value) {
  $I->seeResponseContainsJson(
    array(
      'poll' => array(
        $key => $value
      )
    )
  );
}

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
  2,
  'user array should contain 2 users'
);
$I->seeResponseContainsJson([
  "poll" => [
    "users" => [
      json_decode($user1Json, true),
      json_decode($user2Json, true)
    ]
  ]
]);
$I->seeResponseJsonMatchesJsonPath('poll.users.0.id');
$I->seeResponseJsonMatchesJsonPath('poll.users.1.id');
$user1Id = $I->grabDataFromResponseByJsonPath('poll.users.0.id')[0];
$user2Id = $I->grabDataFromResponseByJsonPath('poll.users.1.id')[0];
\PHPUnit_Framework_Assert::assertTrue(
  $user1Id !== $user2Id,
  'user ids are unique'
);
\PHPUnit_Framework_Assert::assertEquals(
  explode('_', $user1Id)[0],
  $pollId,
  'user id starts by poll id'
);
