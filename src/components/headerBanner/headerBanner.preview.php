<?php

namespace Components\HeaderBanner;

$headerBanner = \Components\HeaderBanner\HeaderBanner::mock();
$headerBannerPreview = new \Components\ComponentPreview\ComponentPreview(
    title: 'HeaderBanner',
    description: 'A header banner component',
    component: $headerBanner
);

print \Components\Blade\render('componentPreview.componentPreview', $headerBannerPreview->toObject());

