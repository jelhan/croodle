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
			$datahandler->_get();
			
			echo json_encode($result);
			break;
		
		// write new data or update existing data	
		case 'set':
			if (!isset($_POST['data'])) break;

			$request = new Request();
			$request->id = (isset($_POST['id'])) ? (string) $_POST['id'] : '';
			$request->version = (isset($_POST['version'])) ? (string) $_POST['version'] : '';
			$request->data = (string) $_POST["data"];
			
			$result = new Result();
			
			$datahandler = new DataHandler($request, $result);
			$datahandler->_set();
			
			echo json_encode($result);
			break;
	}
}

?>
