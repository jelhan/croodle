<?php
$I = new ApiTester($scenario);
$I->wantTo('get an not existing poll');
$I->sendGet('/polls/notExistin');
$I->seeResponseCodeIs(404);
$I->seeResponseEquals('');
