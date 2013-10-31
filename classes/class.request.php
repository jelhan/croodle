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
		if (!isset($this->$name)) throw new Expection("try to get non defined property");
		
		return $this->$name;
	}
	
	public function __set($name, $value) {
		if (!isset($this->$name)) throw new Expection("try to get non defined property");;
		
		switch ($name) {
			case 'data':
				$data = json_decode($value);
				foreach ($data as $p => $v) {
					$this->data->$p = $v;
				}
				break;
				
			default:
				if (!is_string($value)) throw new Expection("wrong data type");
				$this->$name = (string) $value;
		}
	}
}
?>
