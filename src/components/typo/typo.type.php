<?php

namespace Components\Typo;

class Typo extends \Lotsof\Types\Base
{
    public function toHtml(bool $showErrors = null): string
    {

        $faker = \Faker\Factory::create();

        $typo = [
            'suptitle' => $faker->words(random_int(3, 10), true),
            'h1' => $faker->words(random_int(3, 10), true),
            'h2' => $faker->words(random_int(3, 10), true),
            'h3' => $faker->words(random_int(3, 10), true),
            'h4' => $faker->words(random_int(3, 10), true),
            'h5' => $faker->words(random_int(3, 10), true),
            'h6' => $faker->words(random_int(3, 10), true),
            'subtitle' => $faker->words(random_int(3, 10), true),
            'lead' => $faker->paragraphs(random_int(1, 2), true),
            'text' => $faker->paragraphs(random_int(3, 10), true),
            'ul' => "<ul>
                <li>{$faker->words(random_int(3, 10), true)}</li>
                <li>{$faker->words(random_int(3, 10), true)}</li>
                <li>{$faker->words(random_int(3, 10), true)}    
                    <ul>
                        <li>{$faker->words(random_int(3, 10), true)}</li>
                        <li>{$faker->words(random_int(3, 10), true)}</li>
                        <li>{$faker->words(random_int(3, 10), true)}</li>
                    </ul>
                </li>
                <li>{$faker->words(random_int(3, 10), true)}</li>
            </ul>",
            'ol' => "<ol>
                <li>{$faker->words(random_int(3, 10), true)}</li>
                <li>{$faker->words(random_int(3, 10), true)}</li>
                <li>{$faker->words(random_int(3, 10), true)}
                    <ol>
                        <li>{$faker->words(random_int(3, 10), true)}</li>
                        <li>{$faker->words(random_int(3, 10), true)}</li>
                        <li>{$faker->words(random_int(3, 10), true)}</li>
                    </ol>
                </li>
                <li>{$faker->words(random_int(3, 10), true)}</li>
            </ol>",
            "richText" => "
                Dolore est in <strong>voluptate cupidatat</strong> voluptate <em>Lorem magna cupidatat</em> deserunt culpa <a href=\"#\">consequat eu aliqua</a> tempor. <u>Reprehenderit duis</u> culpa id aliqua <small>occaecat amet irure</small> ex adipisicing deserunt <sub>ut officia</sub>. Commodo ut in veniam <sup>adipisicing minim</sup> occaecat laboris do qui. Incididunt officia nulla voluptate nulla consectetur occaecat fugiat magna consectetur do elit laborum. Sunt anim officia do occaecat commodo qui dolore magna aliquip duis do esse. Nostrud cillum ea anim irure. Deserunt sunt est eiusmod occaecat consequat occaecat laboris ad veniam. Culpa aliqua reprehenderit cillum officia esse tempor est minim consectetur consequat nostrud sint ex ullamco. Ex Lorem pariatur amet esse fugiat id do aute eiusmod. Veniam consequat reprehenderit voluptate consequat non consectetur.
            ",
            "blockquote" => $faker->paragraphs(random_int(1, 2), true),
        ];

        return \Components\Blade\render('typo.typo', $typo);
    }
}