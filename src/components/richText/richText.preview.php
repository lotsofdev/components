<?php

namespace Components\RichText;

$richText = \Components\RichText\RichText::mock();
$richTextPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'RichText',
    description: 'A rich text component',
    component: $richText
);

print \Components\Blade\render('componentPreview.componentPreview', $richTextPreview->toObject());

