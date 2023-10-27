<?php

class Model {
  const ENCRYPTED_PROPERTIES = [];
  const PLAIN_PROPERTIES = [];
  const SERVER_PROPERTIES = [];

  protected $data;
  protected $proofKeyKnowledge;

  public function __construct() {
    if (!defined('DATA_FOLDER')) {
      throw new Exception('DATA_FOLDER is not defined');
    }

    if (!is_writable(DATA_FOLDER)) {
      throw new Exception('DATA_FOLDER (' . DATA_FOLDER . ') is not writeable');
    }

    $this->data = new stdClass();
  }

  private static function convertFromStorage($string) {
    return json_decode($string);
  }

  private static function convertToStorage($dataObj) {
    $obj = clone($dataObj);
    unset($obj->id);
    return json_encode($obj);
  }

  /*
   * get new object
   */
  public static function create($data) {
    if (!is_object($data)) {
      throw new Exception('data must be an object');
    }

    $properties = array_merge(
      static::ENCRYPTED_PROPERTIES,
      static::PLAIN_PROPERTIES,
      static::SERVER_PROPERTIES
    );

    // check if all properties exist on data object
    foreach ($properties as $property) {
      if (!property_exists($data, $property)) {
        throw new Exception('property ' . $property . ' does not exist on data object');
      }
    }

    // check that encrypted properties are valid AES
    foreach (static::ENCRYPTED_PROPERTIES as $encryptedProperty) {
      if (!self::isValidSJCL($data->$encryptedProperty)) {
        throw new Exception('property ' . $property . ' is not valid AES');
      }
    }

    $modelName = get_called_class();
    $model = new $modelName;

    foreach ($properties as $property) {
      $model->set($property, $data->$property);
    }

    return $model;
  }

  public function export() {
    $data = new stdClass();
    $publicProperties = array_merge(
      static::ENCRYPTED_PROPERTIES,
      static::PLAIN_PROPERTIES,
      array('id')
    );
    foreach($publicProperties as $publicProperty) {
      $data->$publicProperty = $this->get($publicProperty);
    }

    if (method_exists($this, 'includeRelationships')) {
      $this->includeRelationships($data);
    }

    return $data;
  }

  protected function get($property) {
    if(property_exists($this->data, $property)) {
      return $this->data->$property;
    }
    else {
      return null;
    }
  }

  protected function getDir() {
    throw new Exception ('getDir must be implemented by model');
  }

  protected function getPath() {
    throw new Exception ('getPath must be implemented by model');
  }

  /*
   * Checks if a json string is a proper SJCL encrypted message.
   * False if format is incorrect.
   *
   * Taken from: https://github.com/sebsauvage/ZeroBin/blob/8cae64d6eab99fb0d31868df77846285c0958ed0/index.php#L76-L109
   * Copyright (c) 2012 Sébastien SAUVAGE (sebsauvage.net)
   * License: https://github.com/sebsauvage/ZeroBin/blob/8cae64d6eab99fb0d31868df77846285c0958ed0/README.md
   */
  private static function isValidSJCL($jsonstring) {
    $accepted_keys=array('iv','v','iter','ks','ts','mode','adata','cipher','salt','ct');

    // Make sure content is valid json
    $decoded = json_decode($jsonstring);
    if ($decoded==null) return false;
    $decoded = (array)$decoded;

    // Make sure required fields are present
    foreach($accepted_keys as $k)
    {
        if (!array_key_exists($k,$decoded))  { return false; }
    }

    // Make sure some fields are base64 data
    if (base64_decode($decoded['iv'],$strict=true)==null) { return false; }
    if (base64_decode($decoded['salt'],$strict=true)==null) { return false; }
    if (base64_decode($decoded['cipher'],$strict=true)==null) { return false; }

    // Make sure no additionnal keys were added.
    if (count(array_intersect(array_keys($decoded),$accepted_keys))!=10) { return false; }

    // Reject data if entropy is too low
    $ct = base64_decode($decoded['ct'], $strict=true);
    if (strlen($ct) > strlen(gzdeflate($ct))) return false;

    // Make sure some fields have a reasonable size.
    if (strlen($decoded['iv'])>24) return false;
    if (strlen($decoded['salt'])>14) return false;
    return true;
  }

  /*
   * restore object from storage
   */
  public static function restore($id) {
    if (!static::isValidId($id)) {
      throw new Exception($id . ' is not a valid id');
    }

    $modelName = get_called_class();
    $model = new $modelName;

    $model->set('id', $id);
    $path = $model->getPath();

    if (!is_file($path)) {
      // no poll with this id
      return false;
    }

    try {
      $storageObject = file_get_contents(
        $path
      );

      if ($storageObject === false) {
        // no poll with this id
        return false;
      }
    }
    catch (Exception $e) {
      return false;
    }

    $data = self::convertFromStorage($storageObject);
    $properties = array_merge(
      static::ENCRYPTED_PROPERTIES,
      static::PLAIN_PROPERTIES,
      static::SERVER_PROPERTIES
    );
    foreach ($properties as $property) {
      if (isset($data->$property)) {
        $model->set($property, $data->$property);
      }
    }

    if (method_exists($model, 'restoreHook')) {
      if ($model->restoreHook() === false) {
        return false;
      }
    }

    return $model;
  }

  /*
   * save object to storage
   * gives back new id
   */
  public function save() {
    // create dir for data if it does not exists
    $counter = 0;
    while (true) {
      $this->set('id', $this->generateNewId());

      try {
        if (!is_dir($this->getDir())) {
          if (mkdir($this->getDir()) === false) {
            throw new Exception('could not create the directory ' . $this->getDir() . ' for data object');
          }
        }

        if (!is_writable($this->getDir())) {
          throw new Exception('directory ' . $this->getDir() . ' is not writeable');
        }

        // save data
        if(
          file_put_contents(
            $this->getPath(),
            self::convertToStorage($this->data),
            LOCK_EX
          ) === false
        ) {
          throw new Exception('Could not write data to ' . $this->getPath());
        }
      }
      catch (Exception $e) {
        if ($counter > 5) {
          throw new Exception(
            'write failed more than five times; last path was ' . $this->getPath(),
            0,
            $e
          );
        }

        $counter++;
        continue;
      }

      // successfully run
      break;
    }
  }

  private function set($key, $value) {
    $this->data->$key = $value;
  }
}
