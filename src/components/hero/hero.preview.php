<?php

namespace Components\Hero;

$component = new HeroComponent(HeroType::mock());
print $component->toHtml();