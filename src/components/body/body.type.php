<?php

namespace Components\Body;

class Body extends \Lotsof\Types\Body
{
    public function toHtml(): string
    {
        return \Components\Blade\render('body.body', $this->toObject());
    }
}