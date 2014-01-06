<?php

/*
 * handles the data for api.php
 */
class datahandler {
    // (string) folder to store data in relative to position of api.php
    // webserver has to have write access to this folder
    // must end with a slash
    const DATA_FOLDER = 'data/';
    
    // (int) length of ids used to identify data
    const ID_LENGTH = 10;
    
    // (string) characters used to generate a new id
    const ID_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    /*
     * read data with $id
     * return false, if there is no data with this id or if data could not be read
     */
    public function get($id) {
        // file with absolut path
        $file = self::DATA_FOLDER . $id;
        
        // check if file exists and is readable
        if (!is_readable($file)) {
            return false;
        }
        
        return file_get_contents($file);
    }
    
    /*
     * generates a new Id
     */
    protected function generateNewId()
    {
        // generate random string
        $randomString = '';
        for ($i = 0; $i < self::ID_LENGTH; $i++) {
            $characters = self::ID_CHARACTERS;
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        // check if id is already used, generate new one if necessary
        if (file_exists(self::DATA_FOLDER.$randomString)) {
            $randomString = $this->generateNewId();
        }
        
        return $randomString;
    }
    
    /*
     * stores data
     * returns new id or false on error
     */
    public function write ($data) {
        // get a new id
        $new_id = $this->generateNewId();
        
        $new_file = self::DATA_FOLDER . $new_id;
        
        // check if new file could be created
        if (!is_writeable(self::DATA_FOLDER)) {
            echo "not writeable";
            return false;
        }
        
        // write data
        if (file_put_contents($new_file, $data, LOCK_EX) === false) {
            echo "error on write";
            return false;
        }
        
        return $new_id;
    }
}

?>
