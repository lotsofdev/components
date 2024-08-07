<?php

namespace Components\Section;

class Section extends \Lotsof\Components\Component
{

    protected \Lotsof\Types\Section $data;

    public function toDomElement(): \DOMElement
    {
        $dom = new \DOMDocument('1.0', 'utf-8');
        $section = $dom->createElement('section');
        $classes = ['section'];
        if ($this->fullWidth) {
            $classes[] = '-fullwidth';
        }
        $section->setAttribute('class', implode(' ', $classes));

        // create the body container
        $body = $dom->createElement('div');
        $body->setAttribute('class', 'section_body');

        // create the background container
        $background = $dom->createElement('div');
        $background->setAttribute('class', 'section_background');
        if ($this->image !== null) {
            $imageComponent = new \Components\Image\Image($this->image);
            $background->appendChild($dom->importNode($imageComponent->toDomElement(), true));

        }
        if ($this->video !== null) {
            $videoComponent = new \Components\Video\Video($this->video);
            $background->appendChild($dom->importNode($videoComponent->toDomElement(), true));
        }

        // add the background and body inside the section
        $section->appendChild($background);
        $section->appendChild($body);

        // inject content into section
        $innerHtml = $this->body;
        if (method_exists($this->body, 'toHtml')) {
            $innerHtml = $this->body->toHtml();
        }
        $body->nodeValue = $innerHtml;

        return $section;

    }

}