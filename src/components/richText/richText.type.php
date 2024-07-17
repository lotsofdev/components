<?php

namespace Components\RichText;

class RichText extends \Lotsof\Types\RichText
{
    public function toHtml(): string
    {
        return \Components\Blade\render('richText.richText', $this->toObject());
    }
}