<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    ob_start();
    require_once __DIR__ . '/src/php/index.php';
    $html = ob_get_clean();
    print json_encode(['html' => $html]);
    exit;
}

?>
<!DOCTYPE html>
<html>

<head>
    <title>Lotsof Components</title>
    <meta name='robots' content='noindex, nofollow' />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="http://0.0.0.0:5173/src/css/index.css" />
    <script type="module" src="http://0.0.0.0:5173/src/js/index.ts" defer></script>
</head>

<body>

    <main class="layout-main" id="main">

        <?php
        require_once __DIR__ . '/src/php/index.php';
        ?>

    </main>

    <s-carpenter id="s-carpenter" saveState verbose />

</body>

</html>