<?php

$componentTypeClass = \Lotsof\Types\ImageType::class;
$componentClass = \Components\Image\Image::class;
\Lotsof\Components\Component::preview($componentClass, $componentTypeClass);