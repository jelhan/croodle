<?php
class CleanUpExtension extends \Codeception\Extension
{
  public static $events = array(
    'test.before' => 'beforeTest',
  );

  public function beforeTest(\Codeception\Event\TestEvent $e) {
    if (is_dir(TEST_DATA_DIR)) {
      self::deleteDirRecursively(TEST_DATA_DIR);
    }
    mkdir(TEST_DATA_DIR);
  }

  private static function deleteDirRecursively($dir) {
    $handle = opendir($dir);
    while(false !== ($entry = readdir($handle))) {
      if($entry === '.' || $entry === '..') {
        continue;
      }

      if(is_dir($dir . '/' . $entry)) {
        $method = __METHOD__;
        $method($dir .'/' . $entry);
      }
      else {
        unlink($dir . '/' . $entry);
      }
    }
    rmdir($dir);
  }
}
?>
