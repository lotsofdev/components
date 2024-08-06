<?php

namespace Components\Card;

class Card extends \Lotsof\Types\Card
{
    public function toHtml(bool $showErrors = null): string
    {
        return \Components\Blade\render('card.card', $this->toObject());
    }
}