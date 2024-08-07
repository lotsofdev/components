<?php

$files = glob(__DIR__ . '/**/*.component.php');
foreach ($files as $file) {
    require_once $file;
}