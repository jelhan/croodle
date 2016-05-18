<?php
// clear tmp dir

define('TEST_DATA_DIR', 'tests/_tmp/data/');

if(!is_dir('tests/_tmp')) {
  mkdir('tests/_tmp');
}
