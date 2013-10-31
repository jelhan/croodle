<?php

require_once "class.data.php";

class Request {
	protected $id = '';
	protected $version = '';
	protected $data;
	
	public function __construct() {
		$this->data = new Data();
	}
	
	public function __get($name) {
		if (!isset($this->$name)) return null; // ToDo: throw exception
		return $this->$name;
	}
	
	public function __set($name, $value) {
		if (!isset($this->$name)) return;
		
		switch ($name) {
			case 'data':
				$data = json_decode($value);
				foreach ($data as $p => $v) {
					$this->data->$p = $v;
				}
				break;
				
			default:
				$this->$name = (string) $value;
		}
	}
}
?>
