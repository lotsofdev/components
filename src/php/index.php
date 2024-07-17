<?php

// deps
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../components/index.php';

// routing
$uri = substr($_SERVER['REQUEST_URI'], 1);
$potentialFilePath = __DIR__ . '/../components/' . $uri . '/' . $uri . '.preview.php';

if (file_exists($potentialFilePath)) {
    require_once $potentialFilePath;
} else {
}



