<?php
/*
 * handles maintance jobs
 * should be called on regular basis by cron or something like
 * should only be executable by php cli
 */

if (php_sapi_name() !== 'cli') {
  throw new Exception('chron.php is only executable by php cli');
}

require_once 'classes/poll.php';

$startTime = time();
$pollsProcessed = 0;

$path = substr($argv[0], 0, -8);

define('DATA_FOLDER', $path . '../data/');
$dataDirHandler = opendir(DATA_FOLDER);
if(!$dataDirHandler) {
  throw new Exception('could not open data dir');
}

while(false !== ($pollId = readdir($dataDirHandler))) {
  if(
    $pollId === '.' ||
    $pollId === '..' ||
    !is_dir(DATA_FOLDER . $pollId)
  ) {
    continue;
  }

  // if expiration date is exceeded
  // poll gets deleted on restore
  $poll = Poll::restore($pollId);
  unset($poll);

  $pollsProcessed ++;
}

echo "Notice: run " . ( time() - $startTime ) . " seconds\n";
echo "Notice: processed " . $pollsProcessed . " polls\n";
