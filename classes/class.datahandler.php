<?php

require_once "classes/class.request.php";
require_once "classes/class.data.php";

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
	
	protected $request;
	protected $result;
	
	public function __construct(Request &$request, Result &$result) {
		$this->request =& $request;
		if ($request->id === '') $request->id = $this->getNewId();
		$request->id = preg_replace('/[^0-9a-zA-Z]/', '', $request->id); // remove every char, except allowed
		
		$this->result =& $result;
	}
	
	public function _get() {
		$this->result->id = $this->request->id;
		
		$data = $this->readData();
		if ($data === false) {
			$this->result->result = false;
			$this->result->errorMsg = 'there is no data with this identifier or data could not be read';
			return false;
		}
		
		$this->result->result = true;
		$this->result->version = md5(json_encode($data));
		$this->result->data = $data;
		
		return true;
	}

	public function _set() {
		$this->result->id = $this->request->id;
		
		// try to read existing data
		$data_org = $this->readData();
		if ($data_org !== false) {
			// check if version is out of date
			if (md5(json_encode($data_org)) !== $this->request->version) {
				$this->result->result = false;
				$this->result->errorMsg = 'used version is out of date';
				return false;
			}
		}
		else {
			// check traficLimiter
			if (!$this->traficLimiterCanPass()) {
				$this->result->result = false;
				$this->result->errorMsg = 'to many request in last ' . self::TRAFIC_LIMITER . ' seconds from your IP address';
				return false;
			}
		}
		
		// write data
		if (!$this->writeData($this->request->data)) return $this->result;
		
		$this->result->version = md5(json_encode($this->readData()));
		$this->result->result = true;
		
		return true;
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
		if (is_readable($filename) === false) {
			if (file_put_contents($filename, "<?php\n\$ip_list=array();\n?>") === false) {
				return false;
			}
		}
		
		if (is_writeable($filename) === false) throw new Extension ("File for IP list storage is not writeable. Check permissions.");
		
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
		if (!is_readable(self::DATA_FOLDER.$this->request->id."/head") OR
				!is_readable(self::DATA_FOLDER.$this->request->id."/data")) {
			return false;
		}
		
		$data = new Data();
		$data->head = json_decode(file_get_contents(self::DATA_FOLDER.$this->request->id."/head"));
		$data->data = file_get_contents(self::DATA_FOLDER.$this->request->id."/data");
		
		$user = array();
		$i = 0;
		while (true) {
			if (is_readable(self::DATA_FOLDER.$this->request->id."/user_".$i)) {
				$user[] = file_get_contents(self::DATA_FOLDER.$this->request->id."/user_".$i);
				$i++;
			}
			else break;
		}
		$data->user = $user;
		
		return $data;
	}
	
	protected function writeData($data) {
		if (!file_exists(self::DATA_FOLDER.$this->request->id."/")) {
			if (!mkdir(self::DATA_FOLDER.$this->request->id)) {
				$this->result->result = false;
				$this->result->errorMsg = 'data could not be written';
				return false;
			}
		}
		
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
		if(file_put_contents(self::DATA_FOLDER.$this->request->id.'/'.$typ, $data, LOCK_EX) === false) {
			$this->result->result = false;
			$this->result->errorMsg = 'data could not be written to '.$typ;
			return false;
		}
		
		return true;
	}
}
?>
