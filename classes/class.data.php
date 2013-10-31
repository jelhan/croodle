<?php

class Data {
	protected $head;
	protected $data = '';
	protected $user = array();
	
	public function __construct() {
		$this->head = new stdClass();
	}
	
	public function __get($name) {
		if (!isset($this->$name)) return false; // ToDo: throw exception
		return $this->$name;
	}
	
	public function __set($name, $value) {
		switch ($name) {
			case 'head':
				if (is_object($value)) $this->head = $value;
				break;
				
			case 'data':
				if ($this->is_encrypted($value)) $this->data = $value;
				break;
				
			case 'user':
				if (is_array($value)) $this->user = $value;
				break;
		}
	}
	
	/*
	 * should check if data is encrypted 
	 */
	protected function is_encrypted($data) {
		return true;
	}
}
?>
