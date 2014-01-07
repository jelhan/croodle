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
     * update existing data
     * returns true on success or false on error
     */
    public function update($id, $data) {
        $file = self::DATA_FOLDER . $id;
        
        // check if file is writeable
        if (!is_writeable($file)) {
            return false;
        }
        
        // write data
        if (file_put_contents($file, $data, LOCK_EX) === false) {
            return false;
        }
        
        return true;
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
            
            // check if data folder exists
            if (!file_exists(self::DATA_FOLDER)) {
                
                // try to create data folder
                if(mkdir(self::DATA_FOLDER)) {
                    
                    // put empty index.html in data folder to prevent directory listing
                    file_put_contents(self::DATA_FOLDER . "index.html", '');
                    
                    // check if newly created data folder is writeable
                    if (!is_writeable(self::DATA_FOLDER)) {
                        // data folder created but is not writeable
                        return false;
                    }
                }
                else {
                    // data folder do not exist and can not be created
                    return false;
                }
            }
            else {
                // data folder allready exists but is not writeable
                return false;
            }
        }
        
        // write data
        if (file_put_contents($new_file, $data, LOCK_EX) === false) {
            return false;
        }
        
        return $new_id;
    }
}

?>
