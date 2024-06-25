import * as __glob from 'glob';
import __inquier from 'inquirer';

import { __getConfig } from '@lotsof/config';

import './Components.config.js';

import {
  IComponentGitSourceSettings,
  IComponentsAddComponentOptions,
  IComponentsAddComponentResult,
  IComponentsComponentJson,
  IComponentsSettings,
  IComponentsSourceSettings,
  IComponentsSourcesUpdateResult,
} from './Components.types.js';
import __ComponentSource from './ComponentsSource.js';
import __ComponentGitSource from './sources/ComponentsGitSource.js';

import { __packageRootDir } from '@lotsof/sugar/package';

import {
  __copySync,
  __ensureDirSync,
  __existsSync,
  __readJsonSync,
  __removeSync,
} from '@lotsof/sugar/fs';

import __path from 'path';

import { globSync as __globSync } from 'glob';
import ComponentPackage from './ComponentsPackage.js';
import { __ComponentsComponent } from './_exports.js';

export default class Components {
  private _sources: Record<string, __ComponentSource> = {};
  public settings: IComponentsSettings;

  public get libraryRootDir(): string {
    return this.settings.libraryRootDir;
  }

  constructor(settings?: IComponentsSettings) {
    this.settings = {
      ...(__getConfig('components.settings') ?? {}),
      ...(settings ?? {}),
    };
  }

  public registerSourceFromSettings(
    settings: IComponentsSourceSettings,
  ): __ComponentSource | undefined {
    let source: __ComponentGitSource;
    settings.$components = this;
    switch (settings.type) {
      case 'git':
        source = new __ComponentGitSource(
          <IComponentGitSourceSettings>settings,
        );
        break;
    }

    // @ts-ignore
    if (!source) {
      return;
    }
    return this.registerSource(source);
  }

  public registerSource(source: __ComponentSource): __ComponentSource {
    this._sources[source.id] = source;
    return this._sources[source.id];
  }

  public getSources(): Record<string, __ComponentSource> {
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

  public getComponents(
    sourceIds?: string[],
  ): Record<string, __ComponentsComponent> {
    let componentsList: Record<string, __ComponentsComponent> = {};

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
      addedComponents: __ComponentsComponent[] = [component],
      finalComponentName = component.name,
      componentDestinationDir = `${options.dir}/${component.name}`;

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
        // set the new rootDir
        component.setRootDir(componentDestinationDir);
        return {
          component,
        };
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
    const componentJson: IComponentsComponentJson = __readJsonSync(
      `${component.rootDir}/component.json`,
    );

    // copy the component to the specified directory
    if (!componentJson.subset) {
      // copy the entire component
      component.copyToSync(componentDestinationDir);
    } else {
      let answer: any,
        files: string[] = [],
        copyMap: Record<string, string> = {};

      // add the "files" to the copy map
      if (componentJson.files) {
        for (let file of componentJson.files) {
          const resolvedFiles = __glob.sync(`${component.rootDir}/${file}`);
          for (let resolvedFile of resolvedFiles) {
            const relPath = resolvedFile.replace(`${component.rootDir}/`, '');
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
          const resolvedFiles = __glob.sync(`${component.rootDir}/${file}`);
          for (let resolvedFile of resolvedFiles) {
            const relPath = resolvedFile.replace(`${component.rootDir}/`, '');
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

      // set the new rootDir
      component.setRootDir(componentDestinationDir);
    }

    // handle components dependencies
    if (component.dependencies) {
      for (let [name, dep] of Object.entries(component.dependencies)) {
        switch (dep.type) {
          case 'component':
            const res = await this.addComponent(name, options, true);
            if (res) {
              addedComponents.push(res.component);
            }
            break;
        }
      }
    }

    // handle added components dependencies
    for (let addedComponent of addedComponents) {
      if (!addedComponent.hasDependencies()) {
        continue;
      }
      console.log(
        `Installing dependencies for the "${addedComponent.name}" component...`,
      );
      await addedComponent.installDependencies();
    }

    return {
      component,
    };
  }
}
