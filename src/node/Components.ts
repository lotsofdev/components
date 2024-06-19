import __inquier from 'inquirer';
import * as __glob from 'glob';
import { __addPackageDependencies } from '@lotsof/sugar/package';

import { __getConfig } from '@lotsof/config';

import './Components.config.js';

import { __folderHashSync } from '@lotsof/sugar/fs';

import {
  IComponent,
  IComponentGitSourceSettings,
  IComponentsAddComponentOptions,
  IComponentsAddComponentResult,
  IComponentsSettings,
  IComponentsSourceSettings,
  IComponentsSourcesUpdateResult,
} from './Components.types.js';
import ComponentSource from './ComponentsSource.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';

import { __packageRootDir } from '@lotsof/sugar/package';

import {
  __copySync,
  __ensureDirSync,
  __existsSync,
  __readJsonSync,
  __writeJsonSync,
  __removeSync,
} from '@lotsof/sugar/fs';

import __path from 'path';

import { globSync as __globSync } from 'glob';
import ComponentPackage from './ComponentsPackage.js';

export default class Components {
  private _sources: Record<string, ComponentSource> = {};
  public settings: IComponentsSettings;

  // public get stateFilePath(): string {
  //   return this.settings.stateFilePath ?? `$`;
  // }

  public get libraryRootDir(): string {
    return this.settings.libraryRootDir;
  }

  constructor(settings: IComponentsSettings) {
    this.settings = {
      ...(__getConfig('components.settings') ?? {}),
      ...(settings ?? {}),
    };
  }

  public registerSourceFromSettings(
    settings: IComponentsSourceSettings,
  ): ComponentSource | undefined {
    let source: ComponentGitSource;
    settings.$components = this;
    switch (settings.type) {
      case 'git':
        source = new ComponentGitSource(<IComponentGitSourceSettings>settings);
        break;
    }

    // @ts-ignore
    if (!source) {
      return;
    }
    return this.registerSource(source);
  }

  public registerSource(source: ComponentSource): ComponentSource {
    this._sources[source.id] = source;
    return this._sources[source.id];
  }

  public getSources(): Record<string, ComponentSource> {
    return this._sources;
  }

  public async updateSources(): Promise<IComponentsSourcesUpdateResult> {
    // updating sources

    const sources = this.getSources();

    for (let [sourceId, source] of Object.entries(sources)) {
      await source.update();
    }

    return {
      sources: this.getSources(),
    };
  }

  public getPackages(sourceIds?: string[]): Record<string, ComponentPackage> {
    const packages: Record<string, ComponentPackage> = {};

    // list components in the root folder
    const componentsJsonFiles = __globSync([
      `${this.libraryRootDir}/*/components.json`,
      `${this.libraryRootDir}/*/*/components.json`,
    ]);

    for (let [i, jsonPath] of componentsJsonFiles.entries()) {
      const p = new ComponentPackage(__path.dirname(jsonPath), {
        $components: this,
      });
      packages[p.name] = p;
    }

    return packages;
  }

  public getComponents(sourceIds?: string[]): Record<string, IComponent> {
    let componentsList: Record<string, IComponent> = {};

    const packages = this.getPackages(sourceIds);

    for (let [packageName, p] of Object.entries(packages)) {
      const components = p.getComponents();
      componentsList = {
        ...componentsList,
        ...components,
      };
    }

    return componentsList;
  }

  public async addComponent(
    componentId: string,
    options?: IComponentsAddComponentOptions,
    isDependency = false,
  ): Promise<IComponentsAddComponentResult | undefined> {
    options = {
      dir: `${__packageRootDir()}/src/components`,
      y: false,
      override: false,
      ...(options ?? {}),
    };

    // get components list
    const components = await this.getComponents();

    if (!components[componentId]) {
      console.log(`Component <yellow>${componentId}</yellow> not found.`);
      return;
    }

    let component = components[componentId],
      finalComponentName = component.name,
      componentDestinationDir = `${options.dir}/${component.name}`;

    // read the components state file
    // __ensureDirSync(__path.dirname(this.settings.stateFilePath));
    // let componentsStates: IComponentsState = {
    //   installedHashes: {},
    // };
    // if (__existsSync(this.settings.stateFilePath)) {
    //   componentsStates = __readJsonSync(this.settings.stateFilePath);
    // }

    // override
    if (options.override && !isDependency) {
      console.log(
        `<red>Overriding</red> the component "<yellow>${component.name}</yellow>"...`,
      );
      // delete the existing component
      __removeSync(componentDestinationDir);
    }

    // check if already exists
    if (__existsSync(`${componentDestinationDir}`)) {
      // if it's a dependency, we don't need to ask for a new name
      if (isDependency) {
        return;
      }

      // otherwise, ask for a new name
      const newNameResponse = await __inquier.prompt({
        type: 'input',
        name: 'newName',
        default: `${finalComponentName}1`,
        message: `The component "${finalComponentName}" already exists. Specify a new name for your component`,
      });
      if (newNameResponse.newName) {
        finalComponentName = newNameResponse.newName;
        componentDestinationDir = `${options.dir}/${finalComponentName}`;
      }
    }

    // ensure the directory exists
    __ensureDirSync(options.dir);

    // read the component.json file
    const componentJson = __readJsonSync(`${component.path}/component.json`);

    // copy the component to the specified directory
    if (!componentJson.subset) {
      // copy the entire component
      __copySync(component.path, componentDestinationDir);
    } else {
      let answer: any,
        files: string[] = [],
        copyMap: Record<string, string> = {};

      // add the "files" to the copy map
      if (componentJson.files) {
        for (let file of componentJson.files) {
          const resolvedFiles = __glob.sync(`${component.path}/${file}`);
          for (let resolvedFile of resolvedFiles) {
            const relPath = resolvedFile.replace(`${component.path}/`, '');
            copyMap[resolvedFile] = `${componentDestinationDir}/${relPath}`;
          }
        }
      }

      // copy only the subset of the component
      for (let [subsetCategory, subset] of Object.entries(
        componentJson.subset,
      )) {
        switch (subset.type) {
          case 'list':
            answer = await __inquier.prompt({
              type: 'list',
              default:
                subsetCategory === 'engine'
                  ? this.settings.defaults.engine
                  : null,
              name: subsetCategory,
              message: subset.question,
              choices: subset.choices,
            });
            break;
        }

        // handle answer
        answer = answer[subsetCategory];
        files = subset.files[answer];
        if (!Array.isArray(files)) {
          files = [files];
        }

        // copy the files
        for (let file of files) {
          const resolvedFiles = __glob.sync(`${component.path}/${file}`);
          for (let resolvedFile of resolvedFiles) {
            const relPath = resolvedFile.replace(`${component.path}/`, '');
            copyMap[resolvedFile] = `${componentDestinationDir}/${relPath}`;
          }
        }
      }

      // ensure the directory exists
      if (Object.keys(copyMap).length) {
        __ensureDirSync(componentDestinationDir);
      }

      // copy all the files from the copyMap
      for (let [from, to] of Object.entries(copyMap)) {
        __copySync(from, to);
      }
    }

    // save the installed component hash
    // const installedComponentHash = __folderHashSync(componentDestinationDir);
    // componentsStates.installedHashes[component.name] = installedComponentHash;
    // __writeJsonSync(this.settings.stateFilePath, componentsStates);

    // handle dependencies
    if (componentJson.dependencies) {
      const dependencies: Record<string, IComponent> = {};
      component.dependencies = dependencies;

      for (let [dependencyId, version] of Object.entries(
        componentJson.dependencies,
      )) {
        const dependendiesRes = await this.addComponent(
          dependencyId,
          options,
          true,
        );
        if (dependendiesRes) {
          component.dependencies[dependencyId] = dependendiesRes.component;
        }
      }
    }

    // handle "packageJson" from package
    if (component.package?.componentsJson?.packageJson) {
      // adding npm dependencies
      if (component.package.componentsJson.packageJson.dependencies) {
        console.log('Adding npm dependencies and installing them...');
        await __addPackageDependencies(
          component.package.componentsJson.packageJson.dependencies,
          {
            install: true,
          },
        );
      }
    }

    return {
      component,
    };
  }
}
