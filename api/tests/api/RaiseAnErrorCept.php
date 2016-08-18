<?php
$I = new ApiTester($scenario);
$I->wantTo('raise an error');
$I->sendGet('/polls/ab!cd');
$I->seeResponseCodeIs(500);
$I->seeResponseEquals('');
