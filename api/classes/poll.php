<?php

require_once 'model.php';
require_once 'user.php';

class Poll extends model {
  const ENCRYPTED_PROPERTIES = [
    'anonymousUser',
    'answers',
    'answerType',
    'creationDate',
    'description',
    'expirationDate',
    'forceAnswer',
    'isDateTime',
    'options',
    'pollType',
    'timezone',
    'title'
  ];

  const ID_LENGTH = 10;
  const ID_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const PLAIN_PROPERTIES = [
    'version'
  ];

  const SERVER_PROPERTIES = [
    'serverExpirationDate'
  ];

  private function delete() {
    $this->deleteDirRecursively(
      $this->getDir()
    );
  }
  
  private function deleteDirRecursively($dir) {
    if (substr($dir, -1) !== '/') {
      throw new Exception('dir has to end on /');
    }
    
    $dirHandle = opendir($dir);
    while (false !== ($filename = readdir($dirHandle))) {
      if ($filename === '.' || $filename === '..') {
        continue;
      }

      if (is_dir($dir . $filename)) {
        $this->deleteDirRecursively($dir . $filename . '/');
      }
      elseif (is_file($dir . $filename)) {
        unlink($dir . $filename);
      }
      else {
        throw new Exception($filename . " in " . $dir . " is not a dir neither a file - what is it?");
      }
    }
    closedir($dirHandle);
    
    rmdir($dir);
  }

  protected function generateNewId() {
    $characters = self::ID_CHARACTERS;
    $randomString = '';
    for ($i = 0; $i < self::ID_LENGTH; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
  }
  
  protected function getDir() {
    if (($this->get('id') === null)) {
      throw new Exception('id must be set before calling getDir');
    }
    return DATA_FOLDER . $this->get('id') . '/';
  }

  protected function getPollDir() {
    return $this->getDir();
  }
  
  protected function getPath() {
    return $this->getDir() . 'poll_data';
  }

  protected function getUsers() {
    $users = [];

    $userDir = DATA_FOLDER . $this->get('id') . '/user/';
    if (is_dir($userDir)) {
      $dir = opendir($userDir);
      while(false !== ($file = readdir($dir))) {
        if($file === '.' || $file === '..') {
          continue;
        }

        $users[] = User::restore($this->get('id') . '_' . $file)->export();
      }
      closedir($dir);
    }
    
    return $users;
  }

  protected function includeRelationships(&$data) {
    $data->users = $this->getUsers();
  }

  private function isExpired() {
    return
          ( $expirationDate = DateTime::createFromFormat('Y-m-d\TH:i:s.uO', $this->get('serverExpirationDate')) ) &&
          $expirationDate < new DateTime();
  }

  public static function isValidId($id) {
    $idCharacters = str_split($id);
    return strlen($id) === 10 &&
           count(array_diff($idCharacters, str_split(self::ID_CHARACTERS))) === 0;
  }

  protected function restoreHook() {
    if ($this->isExpired()) {
      $this->delete();
      return false;
    }
  }

  protected function restoreLegacySupportHook(&$data) {
    if (!isset($data->version) || $data->version === 'v0.3-0') {
      if (isset($data->poll) && is_object($data->poll)) {
        $data = $data->poll;
      }
      
      foreach($data as $key => $value) {
        if (strpos($key, 'encrypted') === 0) {
          $newKey = lcfirst(substr($key, 9));
          $data->$newKey = $data->$key;
          unset($data->$key);
        }
      }
    }
  }
}
