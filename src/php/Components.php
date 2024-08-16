<?php

namespace Lotsof\Components;

class Components
{

    protected object $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function getComponentsList(): array
    {
        $components = [];
        $files = glob($this->config->components->rootDir . '/*/component.json');
        foreach ($files as $file) {
            $componentJson = json_decode(file_get_contents($file));
            $componentJson->path = dirname($file);
            $components[$componentJson->name] = $this->getComponent($componentJson->name);
        }

        return $components;
    }

    public function getComponentsListObject(): array
    {
        $components = $this->getComponentsList();
        $components = array_map(function ($component) {
            return $component->toObject();
        }, $components);
        return $components;

    }

    public function componentExists(string $name): mixed
    {
        $componentPath = $this->config->components->rootDir . '/' . $name;
        return file_exists($componentPath);
    }

    public function getComponentPath(string $name): string
    {
        return $this->config->components->rootDir . '/' . $name;
    }

    public function getComponent(string $name, ?bool $details = true): mixed
    {
        if (!$this->componentExists($name)) {
            throw new \Exception('Component "' . $name . '" not found');
        }
        $componentPath = $this->getComponentPath($name);
        $component = new Component($componentPath);
        return $component;
    }

}