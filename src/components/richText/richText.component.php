<?php

namespace Components\RichText;

class RichText extends \Lotsof\Components\Component
{
    protected \Lotsof\Types\RichText $data;

    public function toHtml(): string
    {
        return \Components\Renderer\render('richText.richText', $this->toObject());
    }
}