<?php

namespace Components\Hero;

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true)['component']['values'];
    $hero = new \Components\Hero\Hero();
    $hero->hydrate($data);
    print $hero->toHtml();
    return;
}

for ($i = 1; $i <= 1; $i++) {
    $hero = \Components\Hero\Hero::mock(
    );
    print $hero->toHtml();

    if (!$hero->hasJsonSchema()) {
        continue;
    }

    ?>



    <script carpenter type="application/json">{
                        "id": "<?= $hero->id ?>",
                        "name": "Hero",
                        "description": "Simple hero component",
                        "schema": <?= json_encode($hero->jsonSchema(), JSON_PRETTY_PRINT); ?>,
                        "values": <?= json_encode($hero->toObject(), JSON_PRETTY_PRINT); ?>
                    }</script>

    <?php

}