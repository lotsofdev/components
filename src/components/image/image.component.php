<?php

namespace Components\Image;

class Image extends \Lotsof\Components\Component
{
    protected \Lotsof\Types\ImageType $data;

    public function toDomElement(): \DOMElement
    {
        $dom = new \DOMDocument('1.0', 'utf-8');
        $img = $dom->createElement('img');
        $img->setAttribute('id', $this->id);

        if ($this->src !== null) {
            $img->setAttribute('src', $this->src);
        }
        if ($this->lazy) {
            $img->setAttribute('loading', 'lazy');
        }
        if ($this->title !== null) {
            $img->setAttribute('title', $this->title);
        }
        if ($this->alt !== null) {
            $img->setAttribute('alt', $this->alt);
        }
        if ($this->attrs !== null) {
            foreach ($this->attrs as $key => $value) {
                $img->setAttribute($key, $value);
            }
        }

        return $img;
    }

}