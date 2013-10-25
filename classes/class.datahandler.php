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
	protected $return;
	protected $version;
	
	public function __construct($id = '') {
		if ($id === '') $id = $this->getNewId();
		$this->id = preg_replace('/[^0-9a-zA-Z]/', '', $id); // remove every char, except allowed
		
		$this->return = new stdClass();
	}
	
	public function _get() {
		$this->return->id = $this->id;
		
		$data = $this->readData();
		if ($data === false) {
			$this->return->result = false;
			$this->return->errorMsg = 'there is no data with this identifier or data could not be read';
			return $this->return;
		}
		
		$this->return->result = true;
		$this->return->version = md5(json_encode($data));
		$this->return->data = $data;
		return $this->return;
	}

	public function _set($data, $version = '') {
		$data = (string) $data;
		$version = (string) $version;
		
		$this->return = new stdClass();
		$this->return->id = $this->id;
		
		// try to read existing data
		$data_org = $this->readData();
		if ($data_org !== false) {
			// check if version is out of date
			if (md5(json_encode($data_org)) !== $version) {
				$this->return->result = false;
				$this->return->errorMsg = 'used version is out of date';
				return $this->return;
			}
		}
		else {
			// check traficLimiter
			if (!$this->traficLimiterCanPass()) {
				$this->return->result = false;
				$this->return->errorMsg = 'to many request in last ' . self::TRAFIC_LIMITER . ' seconds from your IP address';
				return $this->return;
			}
		}
		
		// write data
		if (!$this->writeData($data)) return $this->return;
		
		$this->return->version = md5(json_encode($this->readData()));
		$this->return->result = true;
		return $this->return;
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
		
		if (!isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip = $_SERVER['REMOTE_ADDR'];
		} else {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		}

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
		// check if must have files exist
		if (!file_exists(self::DATA_FOLDER.$this->id."/head") OR
				!file_exists(self::DATA_FOLDER.$this->id."/data")) {
			return false;
		}
		
		$data = new stdClass();
		$data->head = file_get_contents(self::DATA_FOLDER.$this->id."/head");
		$data->data = file_get_contents(self::DATA_FOLDER.$this->id."/data");
		
		$data->user = array ();
		$i = 0;
		while (true) {
			if (file_exists(self::DATA_FOLDER.$this->id."/user_".$i)) {
				$data->user[] = file_get_contents(self::DATA_FOLDER.$this->id."/user_".$i);
				$i++;
			}
			else break;
		}
		
		return $data;
	}
	
	protected function writeData($data) {
		if (!file_exists(self::DATA_FOLDER.$this->id."/")) {
			if (!mkdir(self::DATA_FOLDER.$this->id)) {
				$this->return->result = false;
				$this->return->errorMsg = 'data could not be written 1';
				return false;
			}
		}
		
		$data = json_decode($data);
		
		if (!$this->writeDatum('head', json_encode($data->head))) return false;
		if (!$this->writeDatum('data', $data->data)) return false;
		
		$i = 0;
		foreach ($data->user as $user) {
			if(!$this->writeDatum('user_'.$i, $user)) return false;
			$i++;
		}
		
		return true;
	}
	
	protected function writeDatum($typ, $data) {
		if(file_put_contents(self::DATA_FOLDER.$this->id.'/'.$typ, $data, LOCK_EX) === false) {
			$this->return->result = false;
			$this->return->errorMsg = 'data could not be written 2'.$typ;
			return false;
		}
		
		return true;
	}
}
?>
