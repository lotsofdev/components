<?php

namespace Components\Body;

$body = \Components\Body\Body::mock();
$bodyPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'Body',
    description: 'A body component',
    component: $body
);

print \Components\Blade\render('componentPreview.componentPreview', $bodyPreview->toObject());

