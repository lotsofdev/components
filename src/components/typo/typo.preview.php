<?php

namespace Components\Typo;

$typo = new Typo();

$typoPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'Typo',
    description: 'A typo component',
    component: $typo
);

print \Components\Blade\render('componentPreview.componentPreview', $typoPreview->toObject());






