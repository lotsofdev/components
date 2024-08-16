import type { TComponentsDependency } from './Components.types.js';

import { __addPackageDependencies } from '@lotsof/sugar/package';

let __installedDependencies: Record<string, ComponentsDependency> = {};

export default class ComponentsDependency {
  public static resetInstalledDependencies() {
    __installedDependencies = {};
  }

  private _type: 'npm' | 'composer' | 'component';
  private _version: string;
  private _name: string;
  private _dev: boolean;
  private _level: 'library' | 'component';

  public get name(): string {
    return this._name;
  }
  public get type(): 'npm' | 'composer' | 'component' {
    return this._type;
  }
  public get version(): string {
    return this._version;
  }
  public get dev(): boolean {
    return this._dev;
  }
  public get level(): 'library' | 'component' {
    return this._level;
  }

  constructor(dependency: TComponentsDependency) {
    this._type = dependency.type;
    this._name = dependency.name;
    this._version = dependency.version;
    this._dev = dependency.dev ?? false;
    this._level = dependency.level ?? 'library';
  }

  async install(): Promise<ComponentsDependency> {
    // check if already installed
    if (__installedDependencies[`${this.type}-${this.name}-${this.version}`]) {
      return this;
    }

    // mark dependency as installed
    __installedDependencies[`${this.type}-${this.name}-${this.version}`] = this;

    // install the dependency
    return new Promise(async (resolve, reject) => {
      switch (this.type) {
        case 'npm':
          console.log(
            `│ Installing <magenta>NPM</magenta> <yellow>${this.name}</yellow> <cyan>${this.level}</cyan> level dependency...`,
          );

          await __addPackageDependencies(
            {
              [this.name]: this.version,
            },
            {
              dev: this.dev,
              install: true,
            },
          );

          break;
      }

      resolve(this);
    });
  }
}
