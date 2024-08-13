<?php

namespace Components\Body;

$component = new BodyComponent(BodyType::mock());
print $component->toHtml();