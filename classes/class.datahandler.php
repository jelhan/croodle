<?php
class DataHandler {
	// (string) folder to store data in
	// webserver has to have write access to this folder
	// must end with a slash
	const DATA_FOLDER = 'data/';
	
	// (string) filename to store trafic_limiter data
	// could lead to data disclosure if filename extension is not php 
	const IP_LIST_FILENAME = 'trafic_limiter.php';
	
	// (int) limit request per IP in seconds; no limit if zero
	const TRAFIC_LIMITER = 30;
	
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
			$return->errorMsg = 'there is no data with this identifier or data could not be read';
			return $return;
		}
		
		$return->result = true;
		$return->version = md5($data);
		$return->data = $data;
		return $return;
	}

	public function _set($data, $version = '') {
		$data = (string) $data;
		$version = (string) $version;
		
		$return = new stdClass();
		$return->id = $this->id;
		
		// try to read existing data
		$data_org = $this->readData();
		if ($data_org !== false) {
			// check if version is out of date
			if (md5($data_org) !== $version) {
				$return->result = false;
				$return->errorMsg = 'used version is out of date';
				return $return;
			}
		}
		else {
			// check traficLimiter
			if (!$this->traficLimiterCanPass()) {
				$return->result = false;
				$return->errorMsg = 'to many request in last ' . self::TRAFIC_LIMITER . ' seconds from your IP address';
				return $return;
			}
		}
		
		// write data
		if(file_put_contents(self::DATA_FOLDER.$this->id, $data, LOCK_EX ) === false) {
			$return->result = false;
			$return->errorMsg = 'data could not be written';
			return $return;
		}
		
		$return->version = md5($data);
		$return->result = true;
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
		if (file_exists(self::DATA_FOLDER.$randomString)) $randomString = getNewId();
		
		return $randomString;
	}
	
	/*
	 * limit request per IP
	 * returns true on valid request
	 * returns false on invalid request or error
	 */
	protected function traficLimiterCanPass() {
		if (self::TRAFIC_LIMITER === 0) return true;
		
		$ip = $_SERVER['REMOTE_ADDR'];
		$filename = self::DATA_FOLDER.self::IP_LIST_FILENAME;
		
		// create storage for ip_list if not exists
		if (file_exists($filename) === false) {
			if (file_put_contents($filename, "<?php\n\$ip_list=array();\n?>") === false) {
				return false;
			}
		}
		
		// load ip_list
		require $filename;
		
		// check if IP can pass
		if (isset($ip_list[$ip]) && (($ip_list[$ip] + self::TRAFIC_LIMITER) > time())) return false;
		
		// delete expired IPs
		foreach ($ip_list as $ip => $time) {
			if (($time + self::TRAFIC_LIMITER) < time()) unset($ip_list[$ip]);
		}
		
		// add new IP
		$ip_list[$ip] = time();
		
		// save ip_list
		if (file_put_contents($filename, "<?php\n\$ip_list=" . var_export($ip_list, true) . "\n?>") === false) {
			return false;
		}
		
		return true;
	}
	
	protected function readData() {
		return file_exists(self::DATA_FOLDER.$this->id) ? file_get_contents(self::DATA_FOLDER.$this->id) : false;
	}
}
?>
