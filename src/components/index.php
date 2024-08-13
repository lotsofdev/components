<?php

$files = glob(__DIR__ . '/**/*.{component,type}.php', GLOB_BRACE);
foreach ($files as $file) {
    require_once $file;
}