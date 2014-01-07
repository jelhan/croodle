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
    
    // update data
    case 'PUT':
        // get requested id from uri
        $query_paramter = split("/",$_SERVER["QUERY_STRING"]);
        if (isset($query_paramter[2])) {
            $requested_id = $query_paramter[2];
        }
        else {
            throw new Exception("Requested data but there is no ID in URI");
        }
        
        // get data send with request
        $data = file_get_contents('php://input');
        
        // write new data
        $result = $datahandler->update($requested_id, $data);
        
        if ($result === false) {
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
            $newData->poll->id = $requested_id;
            
            // send back data
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
            if (isset($newData->poll)) {
                $newData->poll->id = $newId;
            } elseif (isset($newData->user)) {
                $newData->user->id = $newId;
            }
            
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
