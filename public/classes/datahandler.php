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
    
    public function __construct() {
        // check if data folder exists and is writeable
        // if data folder does not exist, try to create it
        if (!is_writeable(self::DATA_FOLDER)) {
            
            // check if data folder exists
            if (!file_exists(self::DATA_FOLDER)) {
                
                // try to create data folder
                if(mkdir(self::DATA_FOLDER)) {
                    
                    // put empty index.html in data folder to prevent directory listing
                    file_put_contents(self::DATA_FOLDER . "index.html", '');
                    
                    // check if newly created data folder is writeable
                    if (!is_writeable(self::DATA_FOLDER)) {
                        throw new Exception("data folder created but is not writeable");
                    }
                }
                else {
                    throw new Exception("data folder does not exists and can not be created");
                }
            }
            else {
                throw new Exception("data folder already exists but is not writeable");
            }
        }
    }

    private function deletePoll($poll_id) {
        $folder = self::DATA_FOLDER . "/" . $poll_id;
        $user_folder = $folder . "/user";
        
        // delete user folder
        if (is_dir($user_folder)) {
            $dir = opendir($user_folder);
            while(false !== ($file = readdir($dir))) {
                if($file === '.' || $file === '..') {
                  continue;
                }
                unlink($user_folder . '/' . $file);
            }
            closedir($dir);
            rmdir($user_folder);
        }

        unlink($folder . '/poll_data');
        
        rmdir($folder);
    }
    
    /*
     * read poll data
     * return false, if there is no data with this id or if data could not be read
     */
    public function get($poll_id) {
        // file with absolut path
        $folder = self::DATA_FOLDER . "/" . $poll_id;
        $poll_file = $folder . "/poll_data";
        
        // check if file exists and is readable
        if (!is_readable($poll_file)) {
            return false;
        }
        
        $poll_data_json = file_get_contents($poll_file);
        
        $poll_data = json_decode($poll_data_json);

        // check expiration date
        if (
          !empty($poll_data->poll->expirationDate) &&
          DateTime::createFromFormat('Y-m-d\TH:i:s.uO', $poll_data->poll->expirationDate) < new DateTime()
        ) {
            $this->deletePoll($poll_id);
            return false;
        }
        
        // set id to poll
        $poll_data->poll->id = $poll_id;

        $poll_data->poll->users = array();
        
        // check for existing user
        $user_folder = $folder . "/user";
        if (is_dir($user_folder)) {
            // read all existing user data and embedded it into poll
            $files = scandir($user_folder);
            
            // natural sorting of files array to have it in creation order
            natsort($files);
            
            // iterate over all files in folder
            foreach ($files as $file) {
                // embedding full user data
                // read file and extend poll_data;
                $user_data_json = file_get_contents($user_folder . "/" . $file);
                
                if ($user_data_json) {
                    $user_data = json_decode($user_data_json);
                    
                    // extend id to user object
                    $user_data->user->id = $file;
                    
                    // embedd user into poll
                    $poll_data->poll->users[] = $user_data->user;
                }
            }
        }
        
        return json_encode($poll_data);
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
        if (file_exists(self::DATA_FOLDER."/".$randomString)) {
            $randomString = $this->generateNewId();
        }
        
        return $randomString;
    }
    
    /*
     * get next user id for given poll
     */
    protected function getNextUserId($poll_id)
    {
        $user_folder = self::DATA_FOLDER . "/" . $poll_id . "/user";
        
        // check if user folder exists
        if (!file_exists($user_folder)) {
            return 0;
        }
        
        // get all files in user folder
        $files = scandir($user_folder);
        
        // get highest existing id
        $highest_id = 0;
        foreach ($files as $f) {
            if ((int) $f > $highest_id) {
                $highest_id = (int) $f;
            }
        }
        
        return $highest_id + 1;
    }
    
    /*
     * store poll data
     * returns new id or false on error
     */
    public function writePoll ($data) {
        // get a new id
        $new_id = $this->generateNewId();
        
        $folder = self::DATA_FOLDER."/".$new_id;
        $file = $folder . "/poll_data";
        
        // create folder for new poll
        if (!mkdir($folder)) {
            return false;
        }
        
        // write poll data
        if (file_put_contents($file, $data, LOCK_EX) === false) {
            return false;
        }
        
        return $new_id;
    }
    
    /*
     * stores user data belonging to poll
     * returns new id or false on error
     */
    public function writeUser ($poll_id, $data) {
        // get a new id
        $new_id = $this->getNextUserId($poll_id);
        
        // check if poll exists
        if (!is_dir(self::DATA_FOLDER."/".$poll_id)) {
            throw new Exception("poll does not exists");
            return false;
        }
        
        $folder = self::DATA_FOLDER."/".$poll_id."/user";
        $file = $folder . "/" . $new_id;
        
        // check if user folder allready exists
        if (!file_exists($folder)) {
            
            // user folder does not exists, try to create it
            if (!mkdir($folder)) {
                return false;
            }
        }
        
        // write user data
        if (file_put_contents($file, $data, LOCK_EX) === false) {
            return false;
        }
        
        return $new_id;
    }
}

?>
