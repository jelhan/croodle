<?php
/*
 * api.php handels data storage
 * Used by Ember Data RESTAdapter to read and write data on server side
 * 
 * Returns data back to the client on a GET request on ?/poll/:id or ?/user/:id.
 * Save new data on a POST request on ?/polls or ?/users and return new id back.
 * Update poll data on a PUT request on ?/polls/:id.
 * 
 * A check for permissions have to be added on PUT request / update existing data.
 */

// load classes
require_once 'classes/datahandler.php';

// initialize
$datahandler = new datahandler();

// get query parameter
$query_paramter = split("/",$_SERVER["QUERY_STRING"]);
$type = $query_paramter[1];
if (isset($query_paramter[2])) {
    $requested_id = $query_paramter[2];
}

switch ($_SERVER['REQUEST_METHOD']) {
    // read data
    case 'GET':
        // get requested id from uri
        if (!isset($requested_id)) {
            throw new Exception("Requested data but there is no ID in URI");
        }
        
        // read data
        $data = $datahandler->get($requested_id);
        if ($data === false) {
            // there was no data with this id or it could not be readen
            
            // set http header
            header("HTTP/1.0 404 Not Found");
        }
        else {
            // set http header
            header("HTTP/1.0 200 OK");
            
            // forbidde browser to lead javascript from an external location
            header("Content-Security-Policy: script-src 'self'");
            
            // set content-type and charset
            header('Content-Type: application/x-json-encrypted; charset=utf-8');
            
            // send data back
            echo $data;
        }
        
        break;
        
    // write data
    case 'POST':
        $type = $query_paramter[1];
        
        // get data send with request
        $data = file_get_contents('php://input');
        
        switch ($type) {
            case "polls":
                $newId = $datahandler->writePoll($data);
                break;
            
            case "users":
                // get poll id from user data
                $data_decoded = json_decode($data);
                $poll_id = $data_decoded->user->poll_id;
                
                $newId = $datahandler->writeUser($poll_id, $data);
                break;
            
            default:
                throw new Exception("type not defined");
                break;
        }
        
        if ($newId === false) {
            header("HTTP/1.0 500 Internal Server Error");
        }
        else {
            // set http header
            header("HTTP/1.0 200 OK");
            
            // forbidde browser to lead javascript from an external location
            header("Content-Security-Policy: script-src 'self'");
            
            // set content-type and charset
            header('Content-Type: application/x-json-encrypted; charset=utf-8');
            
            switch ($type) {
                case "polls":
                    $newData = $datahandler->get($newId);
                    break;
                
                case "users":
                    $newData = json_decode($data);
                    $newData->user->id = $newId;
                    foreach ($newData->user->selections as $k => $v) {
                        $newData->user->selections[$k]->id = $poll_id + $k;
                    }
                    $newData = json_encode($newData);
                    break;
                
            default:
                throw new Exception("type not defined");
                break;
            }
            
            // send back data
            echo $newData;
        }
        
        break;
    
    // request method is not supported
    default:
        // set http header
        header("HTTP/1.0 400 Bad Request");
        
        break;
}
?>
