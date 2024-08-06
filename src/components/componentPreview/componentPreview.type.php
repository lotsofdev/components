<?php

namespace Components\ComponentPreview;

class ComponentPreview extends \Lotsof\Types\Base
{
    protected string $title;
    protected string $description;
    protected $component = null;

    public function __construct(string $title, string $description = null, $component = null)
    {
        $this->title = $title;
        $this->description = $description;
        $this->component = $component;
    }

}