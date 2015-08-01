<?php
// clear tmp dir
$tmpDataDir = 'tests/_tmp/data';

function deleteDirRecursively($dir) {
  $handle = opendir($dir);
  while(false !== ($entry = readdir($handle))) {
    if($entry === '.' || $entry === '..') {
      continue;
    }
    
    if(is_dir($dir . '/' . $entry)) {
      $function = __FUNCTION__;
      $function($dir .'/' . $entry);
    }
    else {
      unlink($dir . '/' . $entry);
    }
  }
  rmdir($dir);
}

deleteDirRecursively($tmpDataDir);
