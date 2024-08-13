<?php

$componentTypeClass = \Lotsof\Types\VideoType::class;
$componentClass = \Components\Video\Video::class;
\Lotsof\Components\Component::preview($componentClass, $componentTypeClass);