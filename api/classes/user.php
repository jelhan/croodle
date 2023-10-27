<?php

require_once 'model.php';
require_once 'poll.php';

class User extends Model {
  const ENCRYPTED_PROPERTIES = [
    'creationDate',
    'name',
    'selections'
  ];

  const PLAIN_PROPERTIES = [
    'poll',
    'version'
  ];

  protected function generateNewId() {
    $userDir = $this->getDir();

    // check if user folder exists
    if (!file_exists($userDir)) {
      return $this->get('poll') . '_0';
    }

    // get all files in user folder
    $files = scandir($userDir);

    // get highest existing id
    $highestId = 0;
    foreach ($files as $f) {
      if ((int) $f > $highestId) {
        $highestId = (int) $f;
      }
    }

    return $this->get('poll') . '_' . (string) ($highestId + 1);
  }

  protected function getDir() {
    return $this->getPollDir() . 'user/';
  }

  protected function getPollDir() {
    if ($this->get('poll') !== null) {
      $pollId = $this->get('poll');
    }
    else {
      $pollId = explode('_', $this->get('id'))[0];
    }

    if (!Poll::isValidId($pollId)) {
      throw new Exception('Could not get a valid id when getPollDir was called');
    }

    return DATA_FOLDER . $pollId . '/';
  }

  protected function getPath() {
    if (!self::isValidId($this->get('id'))) {
      throw new Exception('no valid user id when getPath was called');
    }
    return $this->getDir() . explode('_', $this->get('id'))[1];
  }

  protected function includeRelationships(&$data) {
    return $data;
  }

  public static function isValidId($id) {
    $parts = explode('_', $id);

    return count($parts) === 2 &&
           Poll::isValidId($parts[0]) &&
           intval($parts[1]) == $parts[1];
  }
}
