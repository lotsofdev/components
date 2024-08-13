<?php

namespace Components\Typo;

class TypoComponent extends \Lotsof\Components\Component
{
    public function toHtml(): string
    {
        return \Components\Renderer\render('typo.typo', $this->toObject());
    }
}