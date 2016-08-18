<?php

// returns config as associative array
function getConfig($path = '') {
  $defaultConfig = include $path . 'config.default.php';

  if (!is_file($path . 'config.php')) {
    return $defaultConfig;
  }

  $userConfig = include $path . 'config.php';
  return array_merge($defaultConfig, $userConfig);
}
