<?php
require_once "classes/class.datahandler.php";

if (isset($_REQUEST['action'])) {
	$action = (string) $_REQUEST['action'];
	
	switch ($action) {
		// get data
		case 'get':
			if (!isset($_GET['id'])) break;
			$id = (string) $_GET['id'];
			
			$datahandler = new DataHandler($id);
			echo json_encode($datahandler->_get());
			break;
		
		// write new data or update existing data	
		case 'set':
			$id = (isset($_POST['id'])) ? (string) $_POST['id'] : 0;
			$version = (isset($_POST['version'])) ? (string) $_POST['version'] : '';
			
			if (!isset($_POST['data'])) break;
			$data = (string) $_POST['data'];
			
			$datahandler = new DataHandler($id);
			echo json_encode($datahandler->_set($data, $version));
			break;
	}
}

?>
