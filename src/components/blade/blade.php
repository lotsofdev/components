<?php

namespace Components\Blade;

$views = realpath(__DIR__ . '/..');
$cache = realpath(__DIR__ . '/cache');
$blade = new \eftec\bladeone\BladeOne($views, $cache, \eftec\bladeone\BladeOne::MODE_DEBUG);
function render($view, $data = [])
{
    global $blade;
    return $blade->run(str_replace('/', '.', $view), (array) $data);
}
