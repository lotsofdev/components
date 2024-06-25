import type {
  IComponentsComponentJson,
  IComponentsComponentSettings,
} from './Components.types.js';

import __ComponentsDependency from './ComponentsDependency.js';

import __ComponentsLibrary from './ComponentsLibrary.js';

import { globSync as __globSync } from 'glob';

import __fs from 'fs';

import { __copySync, __readJsonSync, __renameSync } from '@lotsof/sugar/fs';
import {
  __capitalCase,
  __constantCase,
  __dashCase,
  __dotCase,
  __kebabCase,
  __pascalCase,
  __snakeCase,
  __trainCase,
} from '@lotsof/sugar/string';
import __camelCase from '../../../sugar/dist/shared/string/camelize.js';

export default class ComponentsComponent {
  private _settings: IComponentsComponentSettings;
  private _componentJson: IComponentsComponentJson;
  private _library: __ComponentsLibrary;
  private _rootDir: string;
  private _newName?: string;
  private _dependencies: Record<string, __ComponentsDependency> = {};
  private _originalName: string;

  public get settings(): IComponentsComponentSettings {
    return this._settings;
  }

  public get name(): string {
    return this._newName ?? this._componentJson.name;
  }

  public get description(): string {
    return this._componentJson.description ?? this.name;
  }

  public get library(): __ComponentsLibrary {
    return this._library;
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

  public get dependencies(): Record<string, __ComponentsDependency> {
    return this._dependencies;
  }

  constructor(
    rootDir: string,
    pkg: __ComponentsLibrary,
    settings: IComponentsComponentSettings,
  ) {
    this._settings = settings;
    this._library = pkg;
    this._rootDir = rootDir;
    this._componentJson = __readJsonSync(`${this.rootDir}/component.json`);

    this._originalName = this.componentJson.name;

    this._addDependencies();
  }

  public async renameFilesAndContents(): Promise<void> {
    // list all the files in the component
    const filesPaths = __globSync(`**/*`, {
      cwd: this.rootDir,
    });

    for (let relFilePath of filesPaths) {
      const filePath = `${this.rootDir}/${relFilePath}`;

      // read the file content
      let content = __fs.readFileSync(filePath, 'utf8');

      // replace the component name in the file content
      content = content.replaceAll(
        __camelCase(this._originalName),
        __camelCase(this.name),
      );
      content = content.replaceAll(
        __dashCase(this._originalName),
        __dashCase(this.name),
      );
      content = content.replaceAll(
        __capitalCase(this._originalName),
        __capitalCase(this.name),
      );
      content = content.replaceAll(
        __constantCase(this._originalName),
        __constantCase(this.name),
      );
      content = content.replaceAll(
        __dotCase(this._originalName),
        __dotCase(this.name),
      );
      content = content.replaceAll(
        __kebabCase(this._originalName),
        __kebabCase(this.name),
      );
      content = content.replaceAll(
        __snakeCase(this._originalName),
        __snakeCase(this.name),
      );
      content = content.replaceAll(
        __trainCase(this._originalName),
        __trainCase(this.name),
      );
      content = content.replaceAll(
        __pascalCase(this._originalName),
        __pascalCase(this.name),
      );

      // write the new file content
      __fs.writeFileSync(filePath, content);

      // rename the file
      __renameSync(filePath, this.name);
    }
  }

  public setRootDir(rootDir: string): void {
    this._rootDir = rootDir;
  }

  public setNewName(name: string): void {
    this._newName = name;
  }

  public copyToSync(destDir: string): void {
    __copySync(this.rootDir, destDir);
    this._rootDir = destDir;
  }

  private _addDependencies(): void {
    if (this.componentJson.dependencies) {
      for (let [name, dep] of Object.entries(
        this.componentJson.dependencies ?? {},
      )) {
        const dependency = new __ComponentsDependency({
          type: 'component',
          level: 'component',
          name,
          version: dep,
        });
        this.addDependency(dependency);
      }
    }

    const npmDependencies = {
      ...(this.componentJson?.packageJson?.dependencies ?? {}),
      ...(this.componentJson?.packageJson?.devDependencies ?? {}),
      ...(this.componentJson?.packageJson?.globalDependencies ?? {}),
    };
    if (Object.keys(npmDependencies).length) {
      for (let [name, dep] of Object.entries(npmDependencies)) {
        const dependency = new __ComponentsDependency({
          type: 'npm',
          level: 'component',
          name,
          version: dep,
        });
        this.addDependency(dependency);
      }
    }

    const composerDependencies = {
      ...(this.componentJson.composerJson?.require ?? {}),
      ...(this.componentJson.composerJson?.['require-dev'] ?? {}),
    };
    if (Object.keys(composerDependencies).length) {
      for (let [name, dep] of Object.entries(composerDependencies)) {
        const dependency = new __ComponentsDependency({
          type: 'composer',
          level: 'component',
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

  async installDependencies(
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
}
