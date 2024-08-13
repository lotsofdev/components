<?php

namespace Components\Body;

class BodyComponent extends \Lotsof\Components\Component
{
    public function toDomElement(): \DOMElement
    {
        $dom = new \DOMDocument('1.0', 'utf-8');

        $body = $dom->createElement('div');
        $cls = 'body';
        if ($this->typoClasses) {
            $cls .= ' typo-rhythm typo-format';
        }
        $body->setAttribute('class', $cls);

        if ($this->id !== null) {
            $body->setAttribute('id', $this->id);
        }

        if ($this->suptitle !== '') {
            $suptitle = $dom->createElement('h' . $this->suptitleLevel, $this->suptitle);
            $cls = '_suptitle';
            if ($this->typoClasses) {
                $cls .= ' typo-h' . $this->suptitleLevel;
            }
            $suptitle->setAttribute('class', $cls);
            $body->appendChild($suptitle);
        }

        if ($this->title !== '') {
            $title = $dom->createElement('h' . $this->titleLevel, $this->title);
            $cls = '_title';
            if ($this->typoClasses) {
                $cls .= ' typo-h' . $this->titleLevel;
            }
            $title->setAttribute('class', $cls);
            $body->appendChild($title);
        }

        if ($this->subtitle !== '') {
            $subtitle = $dom->createElement('h' . $this->subtitleLevel, $this->subtitle);
            $cls = '_subtitle';
            if ($this->typoClasses) {
                $cls .= ' typo-h' . $this->subtitleLevel;
            }
            $body->appendChild($subtitle);
        }

        if ($this->lead !== '') {
            $lead = $dom->createElement('p', $this->lead);
            $cls = '_lead';
            if ($this->typoClasses) {
                $cls .= ' typo-lead';
            }
            $lead->setAttribute('class', $cls);
            $body->appendChild($lead);
        }

        if ($this->text !== '') {
            $text = $dom->createElement('p', $this->text);
            $cls = '_text';
            if ($this->typoClasses) {
                $cls .= ' typo-p';
            }
            $text->setAttribute('class', $cls);
            $body->appendChild($text);
        }

        if ($this->has('buttons')) {
            $buttons = $dom->createElement('div');
            $buttons->setAttribute('class', '_buttons');
            foreach ($this->buttons as $button) {
                if ($button->link->has('text')) {
                    $buttonComponent = new \Components\Button\Button($button);
                    $buttons->appendChild($dom->importNode($buttonComponent->toDomElement(), true));
                }
            }
            $body->appendChild($buttons);
        }

        if (!empty($this->attrs)) {
            foreach ($this->attrs as $key => $value) {
                $body->setAttribute($key, $value);
            }
        }

        return $body;

    }
}