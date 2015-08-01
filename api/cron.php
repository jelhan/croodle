<?php
/*
 * handles maintance jobs
 * should be called on regular basis by cron or something like
 * should only be executable by php cli
 */

if (php_sapi_name() !== 'cli') {
  throw new Exception('chron.php is only executable by php cli');
}

require_once('classes/datahandler.php');

$start_time = time();
$polls_processed = 0;
$polls_deleted = 0;

$path = substr($argv[0], 0, -8);

$data_folder = $path . '../data';
$data_folder_handler = opendir($data_folder);
if(!$data_folder_handler) {
  throw new Exception('could not open data folder');
}

while(false !== ($poll_dir = readdir($data_folder_handler))) {
  if(
    $poll_dir === '.' ||
    $poll_dir === '..' ||
    !is_dir($data_folder . $poll_dir)
  ) {
    continue;
  }

  $poll_data_json = file_get_contents($data_folder . $poll_dir . '/poll_data');
  if(!$poll_data_json) {
    echo 'Warning: there is no poll_data file for ' . $poll_dir;
  }
  
  $poll_data = json_decode($poll_data_json);
  if(!$poll_data_json) {
    echo 'Warning: poll_data in ' . $poll_dir . ' does not contain a valid json';
  }

  $polls_processed ++;
  
  if(datahandler::isExpired($poll_data->poll->expirationDate)) {
    $datahandler = new datahandler();
    $datahandler->deletePoll($poll_dir);

    $polls_deleted++;
  }
}

echo "Notice: run " . ( time() - $start_time ) . " seconds\n";
echo "Notice: processed " . $polls_processed . " polls\n";
echo "Notice: deleted ". $polls_deleted . " polls because their expiration date was exceeded\n";
