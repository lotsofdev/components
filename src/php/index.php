<?php

// deps
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/_requires.php';
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
    'component' => str_replace('/', '', $url['path']),
];

switch ($engine) {
    case 'react':
        ?>

        <script type="module"
            src="http://0.0.0.0:5173/src/components/<?= $data['component'] ?>/<?= $data['component'] ?>.preview.ts">
            </script>

        <?php
        break;
    case 'blade':
    case 'twig':
    case 'php':
    default:

        require_once __DIR__ . '/../components/' . $data['component'] . '/' . $data['component'] . '.preview.php';
        break;
}
