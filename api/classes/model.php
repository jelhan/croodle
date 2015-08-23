<?php

class Model {
  const ENCRYPTED_PROPERTIES = [];
  const PLAIN_PROPERTIES = [];
  const PROOF_KEY_KNOWLEDGE = 'validate';
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

    if (
      static::PROOF_KEY_KNOWLEDGE !== 'save' &&
      static::PROOF_KEY_KNOWLEDGE !== 'validate'
    ) {
      throw new Exception('PROOF_KEY_KNOWLEDGE must be "save" or "validate" but is ' . static::PROOF_KEY_KNOWLEDGE);
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

  private function getPathToKeyKnowledgeFile() {
    return $this->getPollDir() . 'key_knowledge';
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

    try {
      $storageObject = file_get_contents(
        $model->getPath()
      );

      if ($storageObject === false) {
        // no poll with this id
        return false;
      }
    }
    catch (Exception $e) {
      // no poll with this id
      return false;
    }
    
    $data = self::convertFromStorage($storageObject);

    $properties = array_merge(
      static::ENCRYPTED_PROPERTIES,
      static::PLAIN_PROPERTIES,
      static::SERVER_PROPERTIES
    );
    foreach ($properties as $property) {
      $model->set($property, $data->$property);
    }

    if (static::PROOF_KEY_KNOWLEDGE === 'save') {
      $model->restoreKeyKnowledge($data);
    }

    if (method_exists($model, 'restoreHook')) {
      if ($model->restoreHook() === false) {
        return false;
      }
    }

    return $model;
  }

  private function restoreKeyKnowledge() {
    try {
      $data = file_get_contents(
        $this->getPathToKeyKnowledgeFile()
      );

      if ($data) {
        return $data;
      }
      else {
        throw new Exception('key knowledge file could not be read');
      }
    }
    catch (Exception $e) {
      return false;
    }
  }

  /*
   * save object to storage
   * gives back new id
   */
  public function save() {
    // proof key knowledge before save
    if (static::PROOF_KEY_KNOWLEDGE === 'validate') {
      $this->validateKeyKnowledge();
    }
    
    // create dir for data if it does not exists
    $counter = 0;
    while (true) {
      $this->set('id', $this->generateNewId());
      
      try {
        if (!is_dir($this->getDir())) {
          if (mkdir($this->getDir()) === false) {
            throw new Exception('could not create the directory for data object');
          }
        }

        if (!is_writable($this->getDir())) {
          throw new Exception('dir is not writeable');
        }

        // save data
        if(
          file_put_contents(
            $this->getPath(),
            self::convertToStorage($this->data),
            LOCK_EX
          ) === false
        ) {
          throw new Exception('write failed...');
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
    
    // save key knowledge after poll is saved
    if (static::PROOF_KEY_KNOWLEDGE === 'save') {
      $this->saveKeyKnowledge();
    }
  }

  private function saveKeyKnowledge() {
    if (
      file_put_contents(
        $this->getPathToKeyKnowledgeFile(),
        $this->proofKeyKnowledge,
        LOCK_EX
      ) === false
    ) {
      throw new Exception('failed to save key knowledge');
    }
  }

  private function set($key, $value) {
    $this->data->$key = $value;
  }

  public function setProofKeyKnowledge($value) {
    $this->proofKeyKnowledge = $value;
  }

   private function validateKeyKnowledge() {
    if (empty($this->proofKeyKnowledge)) {
      throw new Exception('proof key knowledge is not set');
    }

    $keyKnowledge = $this->restoreKeyKnowledge();
    
    if (
      $keyKnowledge !== false &&
      $keyKnowledge !== $this->proofKeyKnowledge
    ) {
      throw new Exception(
        'key knowledge not proofed: ' . $this->proofKeyKnowledge . ' does not equal ' . var_export($keyKnowledge, true)
      );
    }
  }
}
