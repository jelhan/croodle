<?php

return array(
  /*
   * dataDir (String)
   * relative or absolute path to folder where polls are stored
   */
  'dataDir' => getenv('CROODLE__DATA_DIR') ?: '../data/',

  /*
   * debug (Boolean)
   * controls Slim debug mode
   */
  'debug' => getenv('CROODLE__DEBUG') ?: false
);
