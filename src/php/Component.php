<?php

namespace Lotsof\Components;

class Component
{

    protected object $values;
    protected string $path;
    protected object $json;

    public function __construct(string $path, ?object $values = null)
    {
        if ($values) {
            $this->values = $values;
        } else {
            $this->values = (object) [];
        }
        $this->path = $path;
        $this->json = $this->getComponentJson();
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function getName(): string
    {
        return $this->json->name;
    }

    public function getDescription(): string
    {
        return $this->json->description;
    }

    public function getVersion(): string
    {
        return $this->json->version;
    }

    public function setValues(object $values): void
    {
        $this->values = $values;
    }

    public function getValues(): object
    {
        return $this->values;
    }

    public function hasValues(): bool
    {
        return count((array) $this->values) > 0;
    }

    public function toObject(): object
    {
        return (object) [
            'path' => $this->path,
            'name' => $this->json->name,
            'description' => $this->getDescription(),
            'version' => $this->getVersion(),
            'json' => $this->json,
            'files' => $this->getFiles(),
            'engines' => $this->getEngines(),
            'mocks' => $this->getMocks(),
            'schema' => $this->getComponentSchema(),
            'values' => $this->getValues()
        ];
    }

    public function getFiles(): array
    {
        $files = glob($this->path . '/*');
        $files = array_merge($files, glob($this->path . '/**/*'));
        return $files;
    }

    public function getComponentJson(): object
    {
        $componentJsonPath = $this->path . '/component.json';
        if (!file_exists($componentJsonPath)) {
            return null;
        }
        $componentJson = json_decode(file_get_contents($componentJsonPath));
        return $componentJson;
    }

    public function getEngines(): array
    {
        // build a list of supported engines extensions for glob
        $enginesExtensions = [];
        foreach (FACTORY_SUPPORTED_ENGINES as $engine => $extensions) {
            $enginesExtensions = array_merge($enginesExtensions, $extensions);
        }

        // check for ".preview" files
        $files = glob($this->path . '/*{' . implode(',', $enginesExtensions) . '}', GLOB_BRACE);

        // build the supported engines list
        $supportedEngines = [];
        foreach ($files as $filePath) {
            foreach (FACTORY_SUPPORTED_ENGINES as $engine => $extensions) {
                if (preg_match('/(' . implode('|', $extensions) . ')$/', $filePath)) {
                    $supportedEngines[] = $engine;
                }
            }
        }

        return $supportedEngines;
    }

    public function getMocks(): array
    {
        // build a list of supported engines extensions for glob
        $mocksExtensions = [];
        foreach (FACTORY_SUPPORTED_MOCKS_BY_ENGINES as $engine => $extensions) {
            $mocksExtensions = array_merge($mocksExtensions, $extensions);
        }

        // check for ".preview" files
        $files = glob($this->path . '/*{' . implode(',', $mocksExtensions) . '}', GLOB_BRACE);

        // build the supported engines list
        $supportedEngines = [];
        foreach ($files as $filePath) {
            foreach (FACTORY_SUPPORTED_MOCKS_BY_ENGINES as $engine => $extensions) {
                if (preg_match('/(' . implode('|', $extensions) . ')$/', $filePath)) {
                    $supportedEngines[$engine] = $filePath;
                }
            }
        }

        return $supportedEngines;
    }

    public function getComponentSchema(): mixed
    {
        $componentSchemaPath = $this->path . '/' . $this->getName() . '.schema.json';
        if (!file_exists($componentSchemaPath)) {
            return null;
        }
        $componentJson = json_decode(file_get_contents($componentSchemaPath));

        // resolve $ref properties
        $componentJson = $this->_resolveSchemaRefs($componentJson, $componentSchemaPath);

        return $componentJson;
    }

    private function _resolveSchemaRefs(object $schema, string $schemaPath): object
    {
        // resolve $ref properties
        $schema = \Sugar\Object\deepMap($schema, function ($prop, &$value, &$object) use ($schemaPath) {
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
        $schema = \Sugar\Object\deepFilter($schema, function ($prop, $value) {
            if ($prop === '$ref') {
                return false;
            }
            return true;
        });

        return $schema;
    }

}