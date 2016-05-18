<?php

$pollId = substr(md5(__FILE__), 0, 10);
$pollJson = '{"poll":{"encryptedTitle":"{\"iv\":\"G1QGS+OHz5Z6Y4Og/3UFRQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"rgMRyJep4e0+Jj+K0ZTqbJS1j/gaouoTCoSHgXFdccn5L9gHBo1JO7Sl\"}","encryptedDescription":"{\"iv\":\"StcBqdGghIip/N3gLFmTMQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"5fgh7XABR7OifXoqHxE+c89mnVwkKUAG+x7D+BOGzoZK8dGT\"}","encryptedPollType":"{\"iv\":\"JYFdfUTb6xLWja302/bAKQ==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"wW+J3cGGF1tQUNfxt4gENDcZXQ==\"}","encryptedAnswerType":"{\"iv\":\"i0lDlvIVg2Le8pBSb47CIA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"+LNTLmILvxsN1X6E+vWa\"}","encryptedAnswers":"{\"iv\":\"xQV29b/F+gvlLl0zDCB7yw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"n5CwLLhSE5d28NU2/rOB7o6tXXWdDE7/uPr951Rr2ZQsmhsadmVwYE0K3Cxt+Hif4Am1jliS+PFjgVralrsSB00vlIH53wvDqQmNdk1Q/2zIebsVhHueamL4REyXn+18uVrjRarioojwOPYJLxNJHh0kPHATd0TgJxTb87RXgqUvAr1xc6DL7hY+fIbGoa6Otzt+OqIPhRTpaL+My1TYFXWQSlJxpPVSOILe1G/y6wg3Cp1lx4aFdHmGOGmrW+EF5pW9XrIz4A+3kNapSyUsDyuMk8wejrJpRHNcFpIlyRkxgUU=\"}","encryptedOptions":"{\"iv\":\"ruAw1xvAVLh9D19ngrEDgw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"pl1JeMRamWBuScBb1QOT9eqheJG2KD3y8RjtoPhNVid90wmoOQDm6WGtwt+gz6QXQEWUmIIXt8lyAJTH7updSnceW1SihfDi7xMmPTOf/338uSt3RdA2q+F+skiT14gheXHMtSFQaeVGvS8QfDXQfJBY9zJYp+On\"}","encryptedCreationDate":"{\"iv\":\"H/eApLF+Ja7ebX/1tPg7+w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"8BhpHOrgM3L7XftckMdkXSFzXi2evkfheanKfcjMFxzYsg==\"}","encryptedForceAnswer":"{\"iv\":\"DapF8f4GhKPORoIrDPiRXg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"WfPqwu5yBkhrHJWR\"}","encryptedAnonymousUser":"{\"iv\":\"sIclbapCBCxkHi0QrlCqOA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"SXyhfk7DVgfVKfp7Kw==\"}","encryptedIsDateTime":"{\"iv\":\"CbB/QEzDlENL3qRK2ZjWxA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"TD0rnzzHaawAWyUP\"}","encryptedTimezone":"{\"iv\":\"wQQXNefWW5QC9VZ1KkQQmA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"5Zkx8f0WQAgBBG1s0DcxoHeA5Dc/fEI=\"}","version":"v0.3-0"}}';
$user1Json = '{"user":{"encryptedName":"{\"iv\":\"wibexCADUTTMP8vjmegTwA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"r6Vu5fzAgvXctXaCx70/Pr1ldaOE\"}","encryptedSelections":"{\"iv\":\"gCMgC5Rie++L3s42RGzQJg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"jTmkMEkFTUiy8vGJinXAUmi7u8RNQ/FnLgnd+CMKL2XtqjeZuXgfMMDAdTEZnzNQTK7p/IhHBZrcrksUTnWkv68+f76msMs3rOqnYi7jhVL7O7NZMVNXysAgzalrQ+78Zz8TqoJ1qIARksTTCOi7Md07XKkYptCr3QUu0r8kfgk3KbGDuIE3tS4gGuB5CLKuPfFcbE0DjWAcr9IIEXpSPgjzJyEAx3bDd89ZfbRE0RaMoAR7Vqx+L3Hs6pXoUSbtnBJOQypNQYqUYycWA/kxCcuQEBlHwIR5qq7c9VsXNBG9SfGSA62scmbg6pxVXd3jEyTaxw3+B5r705mpMgAEY6NiJykob34x8LThdJP7XZKfe/tyczcKAlcQtJ7ocQsac0l1gRLK6eKHcNs8I3Zzi5iBzyqZtg0OVHzI8NiYpjwvg7piTHawsujAZIYkw/S4Pt29wkbb/heWpUsdJOF2xlfYYkTHnrPbX5jwZbNIgA==\"}","encryptedCreationDate":"{\"iv\":\"NGuUKkuLbabetQG5co01ZA==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"ratk7+pQ14nax+slSf7ttOk2IIbQx7W2iu3I5VuUIR8RGg==\"}","version":"v0.3-0","poll":"gpwW7uZhbP"}}';
$user2Json = '{"user":{"encryptedName":"{\"iv\":\"GsRvWloC3GYi+MoOCUQ1vg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"0upVYhihQhWZcWpXcx5xKGHOTKTcVptz\"}","encryptedSelections":"{\"iv\":\"1FQ0Bf91k3JQbr23AhTszg==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"u6qAugU7o/gTUvjaBrSjlNsU1AJ5oIPiSqrXs7iC7117ss2iX0aENcwsGG09XUk+K1llyrGAI7Fp2uBqn6fyujpacJrJG5oO7SR7F8xwc5TpMlWp/CHN2C9VPdOnm8KhdDtt6IUbNV+McjBxa3FtNVttkF4FAtUGYSurrrEscRad7bvSVbYzYkMs+83xS/ui+pJ3NLuNPntfErRIJw3EKacaUfm2eHCftBVvPHTy3AQbJ9mSKy3tMch+qu1nLnyFSMKjRieCFOgkT3LkQcvfpSteV3V/UNfm82ERy7AYOB8KZ0hW1R/vDp2R+EjFS3/0cw+a8luW6HGcyY0fs18uIbsSUaLOiThKTjp9pYhupXEa9gz1DeZMC51M79Ha4YC9uy3AyG5hH29DYF5yhBPD1Z0iYcgosJ8TweiYN0AvlCYsy939VRSzFGeiI/ZFN76DF0YP1LAOK9bTXHN9n8oyDoQbBMKcY48/uWZZpCAvBw==\"}","encryptedCreationDate":"{\"iv\":\"gLvf5OObVV10vRrQbMcrDw==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"sWHHRuInJDY=\",\"ct\":\"2S5gjZmZ8QQRPfovPpLTbvQLsurgNIHXhkG0Ze8OpTScCw==\"}","version":"v0.3-0","poll":"gpwW7uZhbP"}}';

$pollDir = 'tests/_tmp/data/' . $pollId . '/';
$userDir = $pollDir . 'user/';
mkdir($pollDir);
file_put_contents($pollDir . 'poll_data', $pollJson);
mkdir($userDir);
file_put_contents($userDir . '0', $user1Json);
file_put_contents($userDir . '1', $user2Json);

$I = new ApiTester($scenario);
$I->wantTo('get an existing legacy (v0.3.0) poll with users');
$I->sendGET('/polls/' . $pollId);
$I->seeResponseCodeIs(200);
$I->seeResponseIsJson();

$pollData = json_decode($pollJson, true)["poll"];
unset($pollData["serverExpirationDate"]);
unset($pollData["encryptedIsDateTime"]);
foreach($pollData as $key => $value) {
  if (strpos($key, 'encrypted') === 0) {
    $key = lcfirst(substr($key, 9));
  }
  else {
    $key = $key;
  }
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

function wellformUser($user) {
  $return = $user["user"];
  foreach ($return as $key => $value) {
    if(strpos($key, 'encrypted') === 0) {
      $return[lcfirst(substr($key, 9))] = $value;
      unset($return[$key]);
    }
  }
  return $return;
}
$I->seeResponseContainsJson([
  "poll" => [
    "users" => [
      wellformUser(json_decode($user1Json, true)),
      wellformUser(json_decode($user2Json, true))
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
