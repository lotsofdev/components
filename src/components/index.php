<?php

require_once __DIR__ . '/blade/blade.php';

$files = glob(__DIR__ . '/**/*.type.php');
foreach ($files as $file) {
    require_once $file;
}