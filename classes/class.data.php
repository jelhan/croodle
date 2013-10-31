<?php

class Data implements JsonSerializable {
	protected $head;
	protected $data = '';
	protected $user = array();
	
	public function __construct() {
		$this->head = new stdClass();
	}
	
	public function __get($name) {
		if (!isset($this->$name)) throw new Exception("try to get non defined property");
		return $this->$name;
	}
	
	public function __set($name, $value) {
		switch ($name) {
			case 'head':
				if (!is_object($value)) throw new Exception("wrong data type");
				break;
				
			case 'data':
				if (!$this->is_encrypted($value)) throw new Expection("wrong data type");
				break;
				
			case 'user':
				if (!is_array($value)) throw new Expection("wrong data type");
				foreach ($value as $v) if (!$this->is_encrypted($v)) throw new Expection("wrong data type");
				break;
				
			default:
				throw new Exception("try to set not defined property");
		}
		
		$this->$name = $value;
	}
	
	public function jsonSerialize() {
		$container = new stdClass();
		$container->head = $this->head;
		$container->data = $this->data;
		$container->user = $this->user;
		
		return $container;
	}
	
	/*
	 * should check if data is encrypted 
	 */
	protected function is_encrypted($data) {
		return true;
	}
}
?>
