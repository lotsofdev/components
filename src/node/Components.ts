import * as __glob from 'glob';
import __inquier from 'inquirer';

import { __getConfig } from '@lotsof/config';

import './Components.config.js';

import {
  IComponentsAddComponentOptions,
  IComponentsAddComponentResult,
  IComponentsComponentJson,
  IComponentsLibrariesUpdateResult,
  IComponentsLibrarySettings,
  IComponentsSettings,
} from './Components.types.js';

import { __packageRootDir } from '@lotsof/sugar/package';

import {
  __copySync,
  __ensureDirSync,
  __existsSync,
  __readJsonSync,
} from '@lotsof/sugar/fs';

import __path from 'path';

import { globSync as __globSync } from 'glob';
import __ComponentLibrary from './ComponentsLibrary.js';
import { __ComponentsComponent, __ComponentsLibrary } from './_exports.js';

export default class Components {
  private _libraries: Record<string, __ComponentsLibrary> = {};
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

  public registerLibraryFromSettings(
    settings: IComponentsLibrarySettings,
  ): __ComponentsLibrary {
    settings.$components = this;

    const library = new __ComponentsLibrary(
      `${this.libraryRootDir}/${settings.name}`,
      <IComponentsLibrarySettings>settings,
    );

    return this.registerLibrary(library);
  }

  public registerLibrary(library: __ComponentsLibrary): __ComponentsLibrary {
    this._libraries[library.name] = library;
    return this._libraries[library.name];
  }

  public get libraries(): Record<string, __ComponentsLibrary> {
    return this._libraries;
  }

  public async updateLibraries(): Promise<IComponentsLibrariesUpdateResult> {
    // updating libraries
    const libraries = this.getLibraries();
    for (let [libraryName, library] of Object.entries(libraries)) {
      await library.update();
    }
    return {
      libraries,
    };
  }

  public getLibraries(
    librariesNames?: string[],
  ): Record<string, __ComponentLibrary> {
    const libraries: Record<string, __ComponentLibrary> = {};

    // list components in the root folder
    const componentsJsonFiles = __globSync([
      `${this.libraryRootDir}/*/components.json`,
      `${this.libraryRootDir}/*/*/components.json`,
    ]);

    for (let [i, jsonPath] of componentsJsonFiles.entries()) {
      const p = new __ComponentLibrary(__path.dirname(jsonPath), {
        $components: this,
      });
      libraries[p.name] = p;
    }

    return libraries;
  }

  public getComponents(
    sourceIds?: string[],
  ): Record<string, __ComponentsComponent> {
    let componentsList: Record<string, __ComponentsComponent> = {};

    const libraries = this.getLibraries(sourceIds);

    for (let [libraryName, p] of Object.entries(libraries)) {
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
      ...(options ?? {}),
    };

    // get components list
    const components = await this.getComponents();

    if (!components[componentId]) {
      console.log(`Component <yellow>${componentId}</yellow> not found.`);
      return;
    }

    // get the component from the components list
    let component = components[componentId];

    // handle component name option
    if (options.name) {
      component.setNewName(options.name);
    }

    // handle component destination directory
    let addedComponents: __ComponentsComponent[] = [component],
      componentDestinationDir = `${options.dir}/${component.name}`;

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

      let proposedName = component.name,
        proposedNameI = 0;
      while (__existsSync(`${options.dir}/${proposedName}`)) {
        proposedNameI++;
        proposedName = `${component.name}${proposedNameI}`;
      }

      // otherwise, ask for a new name
      if (!options.y) {
        const newNameResponse = await __inquier.prompt({
          type: 'input',
          name: 'newName',
          default: proposedName,
          message: `The component "${component.name}${
            proposedNameI - 1
          }" already exists. Specify a new name for your component`,
        });
        if (newNameResponse.newName) {
          component.setNewName(newNameResponse.newName);
        }
      } else {
        component.setNewName(proposedName);
      }
    }

    // ensure the directory exists
    __ensureDirSync(options.dir);

    // copy the component to the specified directory
    componentDestinationDir = `${options.dir}/${component.name}`;

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
            if (!options.y) {
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
            } else {
              answer = {
                [subsetCategory]:
                  subsetCategory === 'engine'
                    ? this.settings.defaults.engine
                    : null,
              };
            }
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
      console.log(' ');
      console.log(
        `▓ Component <yellow>${addedComponent.library.name}/${addedComponent.name}</yellow>`,
      );

      // install library level dependencies
      await addedComponent.library.installDependencies();

      // install component level dependencies
      await addedComponent.installDependencies();
    }

    // rename component if needed
    await component.renameFilesAndContents();

    return {
      component,
    };
  }
}
