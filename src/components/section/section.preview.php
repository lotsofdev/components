<?php

namespace Components\Section;

$section = \Components\Section\Section::mock(
);
$sectionPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'Section',
    description: 'A section component',
    component: $section
);

print \Components\Blade\render('componentPreview.componentPreview', $sectionPreview->toObject());

