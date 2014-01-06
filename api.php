<?php
/*
 * api.php handels data storage
 * Used by Ember Data RESTAdapter to read and write data on server side
 * 
 * Returns data back to the client on a GET request on ?/poll/:id or ?/user/:id.
 * Save new data on a POST request on ?/polls or ?/users and return new id back.
 * 
 * There is no need to check for permission because all data stored on server 
 * is encrypted and could only be read with the correct encryption key. There is
 * no update oder delete feature yet.
 */

// load classes
require_once 'classes/datahandler.php';

// initialize
$datahandler = new datahandler();

switch ($_SERVER['REQUEST_METHOD']) {
    // read data
    case 'GET':
        // get requested id from uri
        $query_paramter = split("/",$_SERVER["QUERY_STRING"]);
        if (isset($query_paramter[2])) {
            $requested_id = $query_paramter[2];
        }
        else {
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
            // extend given data with newId
            // this point has to be fixed at it would not work with encrypted json
            $newData = json_decode($data);
            $newData->poll->id = $requested_id;
            
            // set http header
            header("HTTP/1.0 200 OK");
            
            // forbidde browser to lead javascript from an external location
            header("Content-Security-Policy: script-src 'self'");
            
            // set content-type and charset
            header('Content-Type: application/x-json-encrypted; charset=utf-8');
            
            // send data back
            echo json_encode($newData);
        }
        
        break;
    
    // write data
    case 'POST':
        // get data send with request
        $data = file_get_contents('php://input');
        
        $newId = $datahandler->write($data);
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
            
            // extend given data with newId
            // this point has to be fixed at it would not work with encrypted json
            $newData = json_decode($data);
            $newData->poll->id = $newId;
            
            // send back data
            echo json_encode($newData);
        }
        
        break;
    
    // request method is not supported
    default:
        // set http header
        header("HTTP/1.0 400 Bad Request");
        
        break;
}
?>
