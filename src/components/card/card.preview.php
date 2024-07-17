<?php

namespace Components\Card;

$card = \Components\Card\Card::mock();
$cardPreview1 = new \Components\ComponentPreview\ComponentPreview(
    title: 'Card',
    description: 'A card component',
    component: $card
);

print \Components\Blade\render('componentPreview.componentPreview', $cardPreview1->toObject());

