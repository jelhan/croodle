<?php

require_once "classes/class.request.php";
require_once "classes/class.result.php";
require_once "classes/class.datahandler.php";

if (isset($_REQUEST['action'])) {
    $action = (string) $_REQUEST['action'];
    
    switch ($action) {
        // get data
        case 'get':
            if (!isset($_GET['id'])) break;
            $request = new Request();
            $request->id = (string) $_GET['id'];
            
            $result = new Result();
            
            $datahandler = new DataHandler($request, $result);
            $datahandler->get();
            
            header('Content-Type: application/json; charset=utf-8');
            header('Strict-Transport-Security: max-age=86400');
            header("Content-Security-Policy: script-src 'self'");
            
            echo json_encode($result);
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
            
            $result = new Result();
            
            $datahandler = new DataHandler($request, $result);
            $datahandler->set();
            
            header('Content-Type: application/json; charset=utf-8');
            header('Strict-Transport-Security: max-age=86400');
            header("Content-Security-Policy: script-src 'self'");
            
            echo json_encode($result);
            break;
            
        default:
            break;
    }
}

?>
