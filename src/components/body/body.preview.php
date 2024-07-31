<?php

namespace Components\Body;

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true)['component']['values'];
    $body = new \Components\Body\Body();
    $body->hydrate($data);
    print $body->toHtml();
    return;
}

for ($i = 1; $i <= 1; $i++) {
    $body = \Components\Body\Body::mock(
        id: "body-$i"
    );
    print $body->toHtml();

    ?>

    <script carpenter type="application/json">{
                            "id": "body-<?= $i; ?>",
                            "name": "Body",
                            "description": "Simple body (suptitle, titles, subtitle, lead, (rich)text and buttons) component",
                            "schema": <?= json_encode($body->toSchema(), JSON_PRETTY_PRINT); ?>,
                            "values": <?= json_encode($body->toObject(), JSON_PRETTY_PRINT); ?>
                        }</script>

    <?php

}