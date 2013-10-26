<?php

class Data {
	protected $container;
	
	public function __construct() {
		$this->container = new stdClass();
		$this->container->head = new stdClass();
		$this->container->data = '';
		$this->container->user = array();
	}
	
	public function __get($name) {
		if (!isset($name)) return false;
		return $this->container->$name;
	}
	
	public function __set($name, $value) {
		switch ($name) {
			case 'head':
				if (is_object($value)) $this->container->head = $value;
				break;
				
			case 'data':
				if ($this->is_encrypted($value)) $this->container->data = $value;
				break;
				
			case 'user':
				if (is_array($value)) $this->container->user = $value;
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
