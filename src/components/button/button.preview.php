<?php

namespace Components\Button;

$button = \Components\Button\Button::mock();
$buttonPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'Button',
    description: 'A button component',
    component: $button
);

print \Components\Blade\render('componentPreview.componentPreview', $buttonPreview->toObject());

