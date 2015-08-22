<?php
$I = new ApiTester($scenario);
$I->wantTo('get an not existing poll');
$I->sendGet('/polls/abcdEFGH12');
$I->seeResponseCodeIs(404);
$I->seeResponseEquals('');
