<?php

namespace Components\Video;

class Video extends \Lotsof\Components\Component
{

    protected \Lotsof\Types\VideoType $data;

    public function toDomElement(): \DOMElement
    {
        $dom = new \DOMDocument('1.0', 'utf-8');
        $video = $dom->createElement('video');
        $video->setAttribute('id', $this->id);

        if ($this->src !== null) {
            $video->setAttribute('src', $this->src);
        }
        if ($this->poster !== null) {
            $video->setAttribute('poster', $this->poster);
        }
        if ($this->title !== null) {
            $video->setAttribute('title', $this->title);
        }
        if ($this->autoplay) {
            $video->setAttribute('autoplay', '1');
        }
        if ($this->controls) {
            $video->setAttribute('controls', '1');
        }
        if ($this->loop) {
            $video->setAttribute('loop', '1');
        }
        if ($this->muted) {
            $video->setAttribute('muted', '1');
        }
        if ($this->playsinline) {
            $video->setAttribute('playsinline', '1');
        }
        if ($this->attrs !== null) {
            foreach ($this->attrs as $key => $value) {
                $video->setAttribute($key, $value);
            }
        }

        return $video;
    }

}