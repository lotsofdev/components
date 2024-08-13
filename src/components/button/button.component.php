<?php

namespace Components\Button;

class Button extends \Lotsof\Components\Component
{
    protected \Lotsof\Types\ButtonType $data;

    public function __construct(\Lotsof\Types\ButtonType $button)
    {
        parent::__construct($button);
    }

    public function toDomElement(): \DOMElement
    {
        $linkComponent = new \Components\Link\Link($this->data->link);
        $a = $linkComponent->toDomElement();
        $a = \Sugar\dom\changeTagName($a, 'button');
        $a->setAttribute('id', $this->id);
        $a->setAttribute('class', 'button ' . $this->class . ' -' . $this->style);
        return $a;
    }
}