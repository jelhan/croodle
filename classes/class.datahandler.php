<?php
class DataHandler {
	protected $data_folder = 'data/';
	protected $id;
	protected $version;
	
	public function __construct($id = '') {
		if ($id === '') $id = $this->getNewId();
		$this->id = preg_replace('/[^0-9a-zA-Z]/', '', $id); // remove every char, except allowed
	}
	
	public function _get() {
		$return = new stdClass();
		$return->id = $this->id;
		
		$data = $this->readData();
		if ($data === false) {
			$return->result = false;
			$return->errorMsg = 'Es konnten keine Daten mit diesem Identifier gelesen werden.';
		}
		else {
			$return->result = true;
			$return->version = md5($data);
			$return->data = $data;
		}
		return $return;
	}

	public function _set($data, $version = '') {
		$data = (string) $data;
		$version = (string) $version;
		
		$return = new stdClass();
		$return->id = $this->id;
		
		// Prüfen, ob die Version noch aktuell ist, wenn Datei schon besteht
		$data_org = $this->readData();
		if ($data_org !== false && md5($data_org) !== $version) {
			$return->result = false;
			$return->errorMsg = 'Die Version ist nicht mehr aktuell.';
		}
		else {	
			$return->result = file_put_contents($this->data_folder.$this->id, $data, LOCK_EX ) ? true : false;
			if ($return->result === false) $return->errorMsg = 'Die Daten konnten nicht geschrieben werden.';
			else $return->version = md5($data);
		}
		return $return;
	}
	
	protected function getNewId() {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$length = 10;
		
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
		
		// check if id is already used, generate new one if necessary
		if (file_exists($this->data_folder.$randomString)) $randomString = getNewId();
		
    return $randomString;
	}
	
	protected function readData() {
		return file_exists($this->data_folder.$this->id) ? file_get_contents($this->data_folder.$this->id) : false;
	}
}
?>
