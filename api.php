<?php

require_once "classes/class.request.php";
require_once "classes/class.result.php";
require_once "classes/class.datahandler.php";

$result = new Result();

// check if an action ist set
if (!isset($_REQUEST['action'])) {
    $result->status   = 400;
    $result->errorMsg = "No action specified.";
}
else {
    // process the action
    
    $action = (string) $_REQUEST['action'];
    
    switch ($action) {
        // get data
        case 'get':
            if (!isset($_GET['id'])) break;
            $request = new Request();
            $request->id = (string) $_GET['id'];
            
            $datahandler = new DataHandler($request, $result);
            $datahandler->get();
            
            break;
        
        // write new data or update existing data    
        case 'set':
            if (!isset($_POST['data'])) break;

            $request = new Request();
            if (isset($_POST['id'])) {
                $request->id = (string) $_POST['id'];
            } else {
                $request->id = '';
            }
            if (isset($_POST['version'])) {
                $request->version = (string) $_POST['version'];
            } else {
                $request->version = '';
            }
            $request->data = (string) $_POST["data"];
            
            $datahandler = new DataHandler($request, $result);
            $datahandler->set();
            
            break;
           
        // handling not known action types
        default:
            $result->status   = 400;
            $result->errorMsg = "Specified action is not defined.";
            
            break;
    }
}

// send response

// set http status code
switch ($result->status) {
    case "200":
        header("HTTP/1.0 200 OK");
        break;
    
    case "400":
        header("HTTP/1.0 400 Bad Request");
        break;
    
    case "404":
        header("HTTP/1.0 404 Not Found");
        break;
    
    case "409":
        header("HTTP/1.0 409 Conflict");
        break;
    
    case "421":
        header("HTTP/1.0 421 There are too many connections from your internet address");
        break;
    
    case "500":
        header("HTTP/1.0 500 Internal Server Error");
        break;
    
    default:
        header("HTTP/1.0 500 Internal Server Error");
        break;
}

// set content-type and charset
header('Content-Type: application/json; charset=utf-8');

// force browser to stay on httpS connection for 1 day
header('Strict-Transport-Security: max-age=86400');

// forbidde browser to load javascript from an external locatoin
header("Content-Security-Policy: script-src 'self'");

// send data as encoded json
echo json_encode($result);
?>
