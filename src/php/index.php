<?php

// deps
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../components/index.php';

// routing
$url = parse_url($_SERVER['REQUEST_URI']);

$queryString = [];
if (isset($url['query'])) {
    parse_str($url['query'], $queryString);
}

$engine = 'php';
if (isset($queryString['engine'])) {
    $engine = $queryString['engine'];
}

$data = [
    'component' => $url['path'],
];

switch ($engine) {
    case 'ts':
        $previewFilePath = __DIR__ . '/../components/' . $url['path'] . '/' . $url['path'] . '.preview.ts';
        if (file_exists($previewFilePath)) {
            require_once __DIR__ . '/engines/ts.php';
        }
        break;
    case 'blade':
        $previewFilePath = __DIR__ . '/../components/' . $url['path'] . '/' . $url['path'] . '.preview.php';
        if (file_exists($previewFilePath)) {
            require_once __DIR__ . '/engines/blade.php';
        }
        break;
}


