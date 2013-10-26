<?php

require_once "class.data.php";

class Request {
	
	protected $container;
	
	public function __construct() {
		$this->container = new stdClass();
		$this->container->id = '';
		$this->container->version = '';
		$this->container->data = new Data();
	}
	
	public function __get($name) {
		return $this->container->$name;
	}
	
	public function __set($name, $value) {
		switch ($name) {
			case 'data':
				$data = json_decode($value);
				foreach ($data as $p => $v) {
					$this->container->data->$p = $v;
				}
				break;
				
			default:
				$this->container->$name = (string) $value;
		}
	}
}
?>
