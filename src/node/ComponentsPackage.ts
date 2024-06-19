import type {
  IComponent,
  IComponentsPackageJson,
  IComponentsPackageSettings,
} from './Components.types.js';

import { __existsSync } from '@lotsof/sugar/fs';

import { globSync as __globSync } from 'glob';

import { __readJsonSync } from '@lotsof/sugar/fs';

export default class ComponentPackage {
  public settings: IComponentsPackageSettings;
  public componentsJson: IComponentsPackageJson;

  private _rootDir: string;

  public get name(): string {
    return this.componentsJson.name;
  }

  public get description(): string {
    return this.componentsJson.description ?? this.name;
  }

  public get rootDir(): string {
    return this._rootDir;
  }

  public get version(): string {
    return this.componentsJson.version;
  }

  constructor(rootDir: string, settings: IComponentsPackageSettings) {
    this.settings = settings;
    this._rootDir = rootDir;

    // reading the "components.json" file
    this.componentsJson = __readJsonSync(`${this.rootDir}/components.json`);
  }

  getComponents(): Record<string, IComponent> {
    // reading the "components.json" file
    const componentsList: Record<string, IComponent> = {};

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
        const componentJson = __readJsonSync(componentJsonPath);
        componentJson.package = this;
        componentJson.path = `${this.rootDir}/${componentPath}`;
        componentJson.relPath = componentPath;
        componentsList[`${this.name}/${componentJson.name}`] = componentJson;
      }
    }

    return componentsList;
  }
}
