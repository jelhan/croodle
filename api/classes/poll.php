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

  protected function generateNewId() {
    $characters = self::ID_CHARACTERS;
    $randomString = '';
    for ($i = 0; $i < self::ID_LENGTH; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
  }
  
  protected function getDir() {
    return DATA_FOLDER . $this->get('id') . '/';
  }
  
  protected function getPath() {
    return $this->getDir() . 'poll_data';
  }

  protected function getUsers() {
    $users = [];

    $userDir = DATA_FOLDER . $this->get('id') . '/users/';
    if (is_dir($userDir)) {
      $dir = opendir($userDir);
      while(false !== ($file = readdir($dir))) {
        if($file === '.' || $file === '..') {
          continue;
        }

        $users[] = User::restore($this->get('id') . '_' . $file)->export();
      }
    }
    
    return $users;
  }

  protected function includeRelationships(&$data) {
    $data->users = $this->getUsers();
  }

  public static function isValidId($id) {
    $idCharacters = str_split($id);
    return count(array_diff($idCharacters, str_split(self::ID_CHARACTERS))) === 0;
  }
}
