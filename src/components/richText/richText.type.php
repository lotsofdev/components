<?php

namespace Components\RichText;

class RichText extends \Lotsof\Types\RichText
{
    public function toHtml(bool $showErrors = null): string
    {
        return \Components\Blade\render('richText.richText', $this->toObject());
    }
}