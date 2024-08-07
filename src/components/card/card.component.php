<?php

namespace Components\Card;

class Card extends \Lotsof\Components\Component
{
    public function toHtml(): string
    {
        $bodyComponent = new \Components\Body\Body($this->body);
        $image = '';
        if ($this->has('image')) {
            $imageComponent = new \Components\Image\Image($this->image);
            $image = $imageComponent->toHtml();
        }
        $video = '';
        if ($this->has('video')) {
            $videoComponent = new \Components\Video\Video($this->video);
            $video = $videoComponent->toHtml();
        }

        return \Components\Renderer\render('card.card', array_merge((array) $this->toObject(), [
            'body' => $bodyComponent->toHtml(),
            'image' => $image,
            'video' => $video,
        ]));
    }
}