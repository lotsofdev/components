<?php

namespace Components\Link;

class Link extends \Lotsof\Components\Component
{
    protected \Lotsof\Types\LinkType $data;

    public function __construct(\Lotsof\Types\LinkType $link)
    {
        parent::__construct($link);
    }

    public function toDomElement(): \DOMElement
    {
        $dom = new \DOMDocument('1.0', 'utf-8');
        $a = $dom->createElement('a');
        $a->setAttribute('class', 'link');
        $a->setAttribute('id', $this->id);

        if ($this->data->class !== null) {
            $a->setAttribute('class', $this->data->class);
        }
        if ($this->data->href !== null) {
            $a->setAttribute('href', $this->data->href);
        }
        if ($this->data->title !== null) {
        }
        if ($this->data->target !== null) {
            $a->setAttribute('target', $this->data->target);
        }
        // aria-label
        if ($this->data->ariaLabel !== null) {
            $a->setAttribute('aria-label', $this->data->ariaLabel);
        }
        if ($this->data->text !== null) {
            $a->nodeValue = $this->data->text;
        }
        if ($this->data->rel() !== '') {
            $a->setAttribute('rel', $this->data->rel());
        }

        return $a;
    }
}