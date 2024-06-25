import type {
  IComponentsComponentJson,
  IComponentsComponentSettings,
  IComponentsDependencies,
  IComponentsDependency,
  IComponentsPackageSettings,
} from './Components.types.js';

import { __addPackageDependencies } from '@lotsof/sugar/package';

import __ComponentsPackage from './ComponentsPackage.js';

import { __copySync, __readJsonSync } from '@lotsof/sugar/fs';

export default class ComponentsComponent {
  private _settings: IComponentsComponentSettings;
  private _componentJson: IComponentsComponentJson;
  private _package: __ComponentsPackage;
  private _rootDir: string;
  private _dependencies: IComponentsDependencies = {};

  public get settings(): IComponentsComponentSettings {
    return this._settings;
  }

  public get name(): string {
    return this._componentJson.name;
  }

  public get description(): string {
    return this._componentJson.description ?? this.name;
  }

  public get package(): __ComponentsPackage {
    return this._package;
  }

  public get componentJson(): IComponentsComponentJson {
    return this._componentJson;
  }

  public get rootDir(): string {
    return this._rootDir;
  }

  public get version(): string {
    return this._componentJson.version;
  }

  public get dependencies(): IComponentsDependencies {
    return this._dependencies;
  }

  constructor(
    rootDir: string,
    pkg: __ComponentsPackage,
    settings: IComponentsPackageSettings,
  ) {
    this._settings = settings;
    this._package = pkg;
    this._rootDir = rootDir;
    this._componentJson = __readJsonSync(`${this.rootDir}/component.json`);

    this._addDependencies();
  }

  public setRootDir(rootDir: string): void {
    this._rootDir = rootDir;
  }

  public copyToSync(destDir: string): void {
    __copySync(this.rootDir, destDir);
    this._rootDir = destDir;
  }

  private _addDependencies(): void {
    console.log(this.componentJson);

    if (this.componentJson.dependencies) {
      for (let [name, dep] of Object.entries(
        this.componentJson.dependencies ?? {},
      )) {
        this.addDependency(name, {
          name,
          type: 'component',
          version: dep,
        });
      }
    }

    const npmDependencies = {
      ...(this.componentJson?.packageJson?.dependencies ?? {}),
      ...(this.componentJson?.packageJson?.devDependencies ?? {}),
      ...(this.componentJson?.packageJson?.globalDependencies ?? {}),
    };
    if (Object.keys(npmDependencies).length) {
      for (let [name, dep] of Object.entries(npmDependencies)) {
        this.addDependency(name, {
          name,
          type: 'npm',
          version: dep,
        });
      }
    }

    const composerDependencies = {
      ...(this.componentJson.composerJson?.require ?? {}),
      ...(this.componentJson.composerJson?.['require-dev'] ?? {}),
    };
    if (Object.keys(composerDependencies).length) {
      for (let [name, dep] of Object.entries(composerDependencies)) {
        this.addDependency(name, {
          name,
          type: 'composer',
          version: dep,
        });
      }
    }
  }

  public hasDependencies(): boolean {
    console.log(this._dependencies);
    return Object.keys(this._dependencies).length > 0;
  }

  public addDependency(name: string, dependency: IComponentsDependency): void {
    switch (dependency.type) {
      case 'component':
      case 'npm':
      case 'composer':
        this._dependencies[name] = dependency;
        break;
      default:
        throw new Error(
          `Unknown dependency type "${dependency.type}" for dependency "${name}"`,
        );
        break;
    }
  }

  async installDependencies(
    type: 'npm' | 'composer' | ('npm' | 'composer')[] = ['npm', 'composer'],
  ): Promise<void> {
    if (Array.isArray(type) && !type.length) {
      return;
    }
    if (Array.isArray(type)) {
      for (let t of type) {
        await this.installDependencies(t);
      }
      return;
    }

    return new Promise(async (resolve, reject) => {
      switch (type) {
        case 'npm':
          if (this.componentJson.packageJson?.dependencies) {
            console.log(
              `Adding and install dependencies for ${this.name} component...`,
            );
            await __addPackageDependencies(
              this.componentJson.packageJson.dependencies,
              {
                install: true,
              },
            );
          }

          if (this.componentJson.packageJson?.devDependencies) {
            console.log(
              `Adding and install devDependencies for ${this.name} component...`,
            );
            await __addPackageDependencies(
              this.componentJson.packageJson.devDependencies,
              {
                install: true,
              },
            );
          }

          if (this.componentJson.packageJson?.globalDependencies) {
            console.log(
              `Adding and install globalDependencies for ${this.name} component...`,
            );
            await __addPackageDependencies(
              this.componentJson.packageJson.globalDependencies,
              {
                install: true,
              },
            );
          }
          break;
      }

      resolve();
    });
  }
}
