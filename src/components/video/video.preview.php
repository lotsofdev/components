<?php

namespace Components\Video;

$video = \Components\Video\Video::mock();
$videoPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'Video',
    description: 'A video component',
    component: $video
);

print \Components\Blade\render('componentPreview.componentPreview', $videoPreview->toObject());

