import type {
  IComponentsDependencies,
  IComponentsPackageJson,
  IComponentsPackageSettings,
} from './Components.types.js';

import { __existsSync } from '@lotsof/sugar/fs';

import { globSync as __globSync } from 'glob';

import { __readJsonSync } from '@lotsof/sugar/fs';

import __ComponentsComponent from './ComponentsComponent.js';

export default class ComponentsPackage {
  private _settings: IComponentsPackageSettings;
  private _componentsJson: IComponentsPackageJson;
  private _rootDir: string;

  public get settings(): IComponentsPackageSettings {
    return this._settings;
  }

  public get componentsJson(): IComponentsPackageJson {
    return this._componentsJson;
  }

  public get name(): string {
    return this._componentsJson.name;
  }

  public get description(): string {
    return this._componentsJson.description ?? this.name;
  }

  public get rootDir(): string {
    return this._rootDir;
  }

  public get version(): string {
    return this._componentsJson.version;
  }

  public get dependencies(): IComponentsDependencies {
    const dependencies: IComponentsDependencies = {};

    if (this.componentsJson.dependencies) {
      for (let [name, dep] of Object.entries(
        this.componentsJson.dependencies,
      )) {
        dependencies[name] = {
          name,
          type: 'component',
          version: dep,
        };
      }
    }

    const npmDependencies = {
      ...(this.componentsJson.packageJson?.dependencies ?? {}),
      ...(this.componentsJson.packageJson?.devDependencies ?? {}),
      ...(this.componentsJson.packageJson?.globalDependencies ?? {}),
    };
    if (Object.keys(npmDependencies).length) {
      for (let [name, dep] of Object.entries(npmDependencies)) {
        dependencies[name] = {
          name,
          type: 'npm',
          version: dep,
        };
      }
    }

    const composerDependencies = {
      ...(this.componentsJson.composerJson?.require ?? {}),
      ...(this.componentsJson.composerJson?.['require-dev'] ?? {}),
    };
    if (Object.keys(composerDependencies).length) {
      for (let [name, dep] of Object.entries(composerDependencies)) {
        dependencies[name] = {
          name,
          type: 'composer',
          version: dep,
        };
      }
    }

    return dependencies;
  }

  constructor(rootDir: string, settings: IComponentsPackageSettings) {
    this._settings = settings;
    this._rootDir = rootDir;
    this._componentsJson = __readJsonSync(`${this.rootDir}/components.json`);
  }

  getComponents(): Record<string, __ComponentsComponent> {
    // reading the "components.json" file
    const componentsList: Record<string, __ComponentsComponent> = {};

    // check if we have the "components.folders" settings
    let folders = ['src/components/*'];
    if (this.componentsJson?.folders) {
      folders = this.componentsJson.folders;
    }

    // list components
    for (let [i, path] of folders.entries()) {
      const components = __globSync(path, {
        cwd: this.rootDir,
      });

      for (let [j, componentPath] of components.entries()) {
        const componentJsonPath = `${this.rootDir}/${componentPath}/component.json`;
        // make sure e have a component.json file
        if (!__existsSync(componentJsonPath)) {
          continue;
        }

        const component = new __ComponentsComponent(
          `${this.rootDir}/${componentPath}`,
          this,
          {
            $components: this.settings.$components,
          },
        );
        componentsList[`${this.name}/${component.name}`] = component;
      }
    }

    return componentsList;
  }
}
