import type {
  TComponentsLibraryJson,
  TComponentsLibrarySettings,
  TComponentsLibraryUpdateResult,
} from './Components.types.js';

import __childProcess from 'child_process';

import __ComponentsDependency from './ComponentsDependency.js';

import { __existsSync } from '@lotsof/sugar/fs';

import { globSync as __globSync } from 'glob';

import { __readJsonSync } from '@lotsof/sugar/fs';

import __ComponentsComponent from './ComponentsComponent.js';

export default class ComponentsLibrary {
  private _settings: TComponentsLibrarySettings;
  private _componentsJson: TComponentsLibraryJson;
  private _rootDir: string;
  private _dependencies: Record<string, __ComponentsDependency> = {};

  public updated: boolean = false;

  public get settings(): TComponentsLibrarySettings {
    return this._settings;
  }

  public get componentsJson(): TComponentsLibraryJson {
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

  public get dependencies(): Record<string, __ComponentsDependency> {
    return this._dependencies;
  }

  constructor(rootDir: string, settings: TComponentsLibrarySettings) {
    this._settings = settings;
    this._rootDir = rootDir;
    this._componentsJson = __readJsonSync(
      `${this.rootDir}/componentsLibrary.json`,
    );
    this._addDependencies();
  }

  getComponents(): Record<string, __ComponentsComponent> {
    // reading the "componentsLibrary.json" file
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

    // sort alphabetically
    const sorted = Object.keys(componentsList).sort();
    const sortedComponentsList: Record<string, __ComponentsComponent> = {};
    for (let key of sorted) {
      sortedComponentsList[key] = componentsList[key];
    }

    // return sorted list
    return sortedComponentsList;
  }

  private _addDependencies(): void {
    if (this.componentsJson.dependencies) {
      for (let [name, dep] of Object.entries(
        this.componentsJson.dependencies ?? {},
      )) {
        const dependency = new __ComponentsDependency({
          type: 'component',
          level: 'library',
          name,
          version: dep,
        });
        this.addDependency(dependency);
      }
    }

    const npmDependencies = {
      ...(this.componentsJson?.packageJson?.dependencies ?? {}),
      ...(this.componentsJson?.packageJson?.devDependencies ?? {}),
      ...(this.componentsJson?.packageJson?.globalDependencies ?? {}),
    };
    if (Object.keys(npmDependencies).length) {
      for (let [name, dep] of Object.entries(npmDependencies)) {
        const dependency = new __ComponentsDependency({
          type: 'npm',
          level: 'library',
          name,
          version: dep,
        });
        this.addDependency(dependency);
      }
    }

    const composerDependencies = {
      ...(this.componentsJson.composerJson?.require ?? {}),
      ...(this.componentsJson.composerJson?.['require-dev'] ?? {}),
    };
    if (Object.keys(composerDependencies).length) {
      for (let [name, dep] of Object.entries(composerDependencies)) {
        const dependency = new __ComponentsDependency({
          type: 'composer',
          level: 'library',
          name,
          version: dep,
        });
        this.addDependency(dependency);
      }
    }
  }

  public hasDependencies(): boolean {
    return Object.keys(this._dependencies).length > 0;
  }

  public addDependency(dependency: __ComponentsDependency): void {
    this._dependencies[dependency.name] = dependency;
  }

  public async installDependencies(
    type: 'npm' | 'composer' | ('npm' | 'composer')[] = ['npm', 'composer'],
  ): Promise<__ComponentsDependency[]> {
    let installedDependencies: __ComponentsDependency[] = [];

    if (Array.isArray(type) && !type.length) {
      return [];
    }
    if (Array.isArray(type)) {
      for (let t of type) {
        const dep = await this.installDependencies(t);
        installedDependencies = {
          ...installedDependencies,
          ...dep,
        };
      }
      return installedDependencies;
    }

    return new Promise(async (resolve, reject) => {
      for (let [name, dep] of Object.entries(this.dependencies)) {
        if (type !== dep.type) {
          continue;
        }
        await dep.install();
        installedDependencies.push(dep);
      }

      resolve(installedDependencies);
    });
  }

  async update(): Promise<TComponentsLibraryUpdateResult> {
    // get the componentsLibrary.json file from the updated component
    const componentsJson = __readJsonSync(
      `${this.settings.$components.libraryRootDir}/${this.name}/componentsLibrary.json`,
    );

    // check dependencies
    for (let [name, sourceSettings] of Object.entries(
      componentsJson.dependencies ?? {},
    )) {
      // if source already registered, avoid continue
      const libraries = this.settings.$components.getLibraries();
      let newSource = libraries[name];
      if (!libraries[name]) {
        // register new library
        newSource = this.settings.$components?.registerLibraryFromSettings(
          <TComponentsLibrarySettings>sourceSettings,
        );
      }

      // cloning the repo
      const res = await __childProcess.spawnSync(
        `git clone ${this.settings.url} ${this.settings.$components.libraryRootDir}/${this.name}`,
        [],
        {
          shell: true,
        },
      );

      const output = res.output?.toString() ?? '';

      this.updated = !output.match(/already exists/);

      if (output.includes('already exists')) {
        // try to pull the repo
        const pullRes = await __childProcess.spawnSync(`git pull`, [], {
          cwd: `${this.settings.$components.libraryRootDir}/${this.name}`,
          shell: true,
        });
        const pullOutput = pullRes.output?.toString().split(',').join('') ?? '';
        this.updated = !pullOutput.match(/Already up to date/);
      }

      // updating new source
      await newSource?.update();
    }

    return {
      updated: this.updated,
    };
  }
}
