<?php

namespace Components\Hero;

class HeroComponent extends \Lotsof\Components\Component
{
    protected \Lotsof\Types\HeroType $data;


    public function toDomElement(): \DOMElement
    {
        $dom = new \DOMDocument('1.0', 'utf-8');
        $section = $dom->createElement('section');
        $classes = ['hero'];
        $section->setAttribute('class', implode(' ', $classes) . ' -' . $this->size . ' -' . $this->align . ' -' . $this->theme);
        $section->setAttribute('id', $this->id);

        // create the body container
        $body = $dom->createElement('div');
        $body->setAttribute('class', '_body');

        // create the background container
        $background = $dom->createElement('div');
        $background->setAttribute('class', '_background');
        if ($this->image->has('src')) {
            $imageComponent = new \Components\Image\Image($this->image);
            $background->appendChild($dom->importNode($imageComponent->toDomElement(), true));
        }
        if ($this->video->has('src')) {

            $videoComponent = new \Components\Video\Video($this->video);
            $background->appendChild($dom->importNode($videoComponent->toDomElement(), true));
        }

        // add the background and body inside the section
        $section->appendChild($background);
        $section->appendChild($body);

        // inject content into section
        $bodyComponent = new \Components\Body\BodyComponent($this->body);
        $body->appendChild($dom->importNode($bodyComponent->toDomElement(), true));

        return $section;

    }
}

return HeroComponent::class;