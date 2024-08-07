<?php

namespace Lotsof\Components;

class Component
{
    public static function preview($componentClass, $dataClass)
    {
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method === 'POST') {
            $request_body = file_get_contents('php://input');
            $data = json_decode($request_body, true)['component']['values'];
            $componentData = new $dataClass();
            $componentData->hydrate($data);
            $component = new $componentClass($componentData);
            print $component->toHtml();
            return;
        } else {
            $componentData = $dataClass::mock();
            $component = new $componentClass($componentData);
            ?>
            <?= $component->toHtml() ?>
            <script carpenter type="application/json">{
                        "id": "<?= $component->id; ?>",
                        "name": "Body",
                        "description": "Simple body (suptitle, titles, subtitle, lead, (rich)text and buttons) component",
                        "schema": <?= json_encode($component->jsonSchema(), JSON_PRETTY_PRINT); ?>,
                        "values": <?= json_encode($component->toObject(), JSON_PRETTY_PRINT); ?>
                    }</script>
            <?php
        }
    }

    protected string $id;
    private bool $_showErrors = false;

    public function __construct(?\Lotsof\Types\Base $data, ?string $id = null)
    {
        // save the data internaly
        if ($data !== null) {
            $this->data = $data;
        }

        // handle id
        if ($id === null && $data->has('id')) {
            $id = $data->id;
        }
        if ($id === null) {
            $classInfo = new \ReflectionClass($this);
            $classFullName = $classInfo->getName();
            $classNameParts = explode('\\', $classFullName);
            $className = end($classNameParts);
            $this->id = strtolower($className) . '-' . uniqid();
        } else {
            $this->id = $id;
        }
    }

    public function showErrors(bool $value): void
    {
        $this->_showErrors = $value;
    }

    public function __get($prop): mixed
    {
        if (property_exists($this->data, $prop)) {
            return $this->data->$prop;
        }
        return null;
    }

    public function __toString(): string
    {
        if (method_exists($this, 'toHtml')) {
            return $this->toHtml();
        }
        return '';
    }

    public function has(string $prop): bool
    {
        if (!property_exists($this->data, $prop)) {
            return false;
        }
        if (is_string($this->data->$prop) && $this->data->$prop === '') {
            return false;
        }
        if (is_array($this->data->$prop) && count($this->data->$prop) === 0) {
            return false;
        }
        if ($this->data->$prop === null) {
            return false;
        }
        return true;
    }

    public function set(string $key, mixed $value): void
    {
        $this->data->set($key, $value);
    }

    private function _resolveSchemaRefs(object $schema, string $schemaPath): object
    {
        // resolve $ref properties
        $schema = \Sugar\object\deepMap($schema, function ($prop, &$value, &$object) use ($schemaPath) {
            if ($prop === '$ref') {
                $relPath = realpath(dirname($schemaPath) . '/' . $value);
                if (!file_exists($relPath)) {
                    throw new \Exception('Schema "' . $relPath . '" file not found referenced in "' . $schemaPath . '"');
                }
                $schema = file_get_contents($relPath);
                $schema = json_decode($schema);
                foreach ($schema as $key => $val) {
                    $object->$key = $val;
                }
                return -1;
            }
            return $value;
        });

        // remove all $ref properties
        $schema = \Sugar\object\deepFilter($schema, function ($prop, $value) {
            if ($prop === '$ref') {
                return false;
            }
            return true;
        });

        return $schema;
    }

    public function jsonSchemaPath(): string
    {
        $classInfo = new \ReflectionClass($this);
        $folderPath = dirname($classInfo->getFileName());
        $className = explode("\\", basename($classInfo->getName()));
        $className = end($className);
        $schemaPath = $folderPath . '/' . \Sugar\string\camelCase($className) . '.schema.json';
        return $schemaPath;
    }

    public function hasJsonSchema(): bool
    {
        $path = $this->jsonSchemaPath();
        return file_exists($path);
    }

    public function jsonSchema(): object
    {
        $schemaPath = $this->jsonSchemaPath();
        if ($this->hasJsonSchema()) {
            $schema = file_get_contents($schemaPath);
            $schema = json_decode($schema);
            $schema = $this->_resolveSchemaRefs($schema, $schemaPath);
            return $schema;
        }

        throw new \Exception('Schema file not found for class ' . get_class($this) . ' at path "' . $schemaPath . ". Either create it or implement your own \"jsonSchema\" method...");
    }

    public function toObject(): object
    {
        $showErrors = $this->_showErrors;
        $this->showErrors(false);

        $vars = $this->data->toObject();

        // reset show errors
        $this->showErrors($showErrors);

        return (object) $vars;
    }

    public function toHtml(): string
    {
        // if ($this->_showErrors === true) {
        //     $validationResults = $this->validate();
        //     if (count($validationResults)) {
        //         $classInfo = new \ReflectionClass($this);
        //         $className = $classInfo->getName();
        //         $errorsHtml = ['<div class="error">'];
        //         $errorsHtml[] = '<h2 class="error_title">' . $className . ' | Validation errors</h2>';
        //         $errorsHtml[] = '<ol class="error_items">';
        //         foreach ($validationResults as $error) {
        //             $property = $error['property'] !== '' ? $error['property'] : 'unknown';
        //             $errorsHtml[] = '<li class="error_item"><span class="error_prop">' . $property . '</span>: <span class="error_message">' . $error['message'] . '</span>';
        //         }
        //         $errorsHtml[] = '</ol>';
        //         $errorsHtml[] = '</div>';
        //         return implode("\n", $errorsHtml);
        //     }
        // }

        if (!method_exists($this, 'toDomElement')) {
            throw new \Exception('toDomElement method not found in class ' . get_class($this) . '. You will need to implement your own \"toHtml\" method...');
        }
        $dom = new \DOMDocument('1.0', 'utf-8');
        $dom->appendChild($dom->importNode($this->toDomElement(), true));
        return $dom->saveHTML();
    }

}