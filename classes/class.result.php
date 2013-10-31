<?php

class result {
	protected $result = false;
	protected $version = '';
	protected $id = '';
	protected $data = '';
	protected $errorMsg = '';
	
	public function __construct() {
		
	}
	
	public function __get($name) {
		if (!isset($this->$name)) return null; // ToDo: throw exception
		return $this->$name;
	}
	
	public function __set($name, $value) {
		if (!isset($this->$name)) return; // ToDo: throw exception
		
		switch ($name) {
			case 'result':
				$value = (boolean) $value;
				break;
			
			default:
				$value = (string) $value;
		}
		
		$this->$name = $value;
	}
	
	public function __toString() {
		$container = new stdClass();
		$container->result = $this->result;
		$container->version = $this->version;
		$container->id = $this->id;
		$container->data = $this->data;
		$container->errorMsg = $this->errorMsg;
		return json_encode($container);
	}
}
?>
