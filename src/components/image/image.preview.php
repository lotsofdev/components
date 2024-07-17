<?php

namespace Components\Image;

$image = \Components\Image\Image::mock();
$imagePreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'Image',
    description: 'An image component',
    component: $image
);

print \Components\Blade\render('componentPreview.componentPreview', $imagePreview->toObject());

