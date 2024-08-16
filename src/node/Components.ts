import * as __glob from 'glob';
import __inquier from 'inquirer';

import { __isCommandExists } from '@lotsof/sugar/is';

import { __getConfig } from '@lotsof/config';

import './Components.config.js';

import {
  TComponentsAddComponentOptions,
  TComponentsAddComponentResult,
  TComponentsComponentJson,
  TComponentsLibrariesUpdateResult,
  TComponentsLibrarySettings,
  TComponentsSettings,
} from './Components.types.js';

import { __packageRootDir } from '@lotsof/sugar/package';

import { __unique } from '@lotsof/sugar/array';

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
  public settings: TComponentsSettings;

  public get libraryRootDir(): string {
    return this.settings.libraryRootDir;
  }

  constructor(settings?: TComponentsSettings) {
    this.settings = {
      ...(__getConfig('components.settings') ?? {}),
      ...(settings ?? {}),
    };

    // check dependencies
    this.checkDependencies();
  }

  public async checkDependencies(): Promise<void> {
    const npmExists = await __isCommandExists('npm'),
      composerExists = await __isCommandExists('composer');
    if (!npmExists) {
      throw new Error(
        `The <yellow>npm</yellow> command is required to install dependencies.`,
      );
    }
    if (!composerExists) {
      throw new Error(
        `The <yellow>composer</yellow> command is required to install dependencies.`,
      );
    }
  }

  public registerLibraryFromSettings(
    settings: TComponentsLibrarySettings,
  ): __ComponentsLibrary {
    settings.$components = this;

    const library = new __ComponentsLibrary(
      `${this.libraryRootDir}/${settings.name}`,
      <TComponentsLibrarySettings>settings,
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

  public async updateLibraries(): Promise<TComponentsLibrariesUpdateResult> {
    // updating libraries
    const libraries = this.getLibraries();
    for (let [libraryName, library] of Object.entries(libraries)) {
      await library.update();
    }
    return {
      libraries,
    };
  }

  public getLibraries(): Record<string, __ComponentLibrary> {
    const libraries: Record<string, __ComponentLibrary> = {};

    // list components in the root folder
    const componentsJsonFiles = __globSync([
      `${this.libraryRootDir}/*/componentsLibrary.json`,
      `${this.libraryRootDir}/*/*/componentsLibrary.json`,
    ]);

    for (let [i, jsonPath] of componentsJsonFiles.entries()) {
      const componentsJson = __readJsonSync(jsonPath);
      const p = new __ComponentLibrary(__path.dirname(jsonPath), {
        type: componentsJson.type ?? 'git',
        url: componentsJson.url,
        name: componentsJson.name,
        $components: this,
      });
      libraries[p.name] = p;
    }

    return libraries;
  }

  public getComponents(): Record<string, __ComponentsComponent> {
    let componentsList: Record<string, __ComponentsComponent> = {};

    const libraries = this.getLibraries();

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
    options?: TComponentsAddComponentOptions,
    isDependency = false,
  ): Promise<TComponentsAddComponentResult | undefined> {
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
      component.setName(options.name);
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
          addedComponents,
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
          component.setName(newNameResponse.newName);
        }
      } else {
        component.setName(proposedName);
      }
    }

    // ensure the directory exists
    __ensureDirSync(options.dir);

    // copy the component to the specified directory
    componentDestinationDir = `${options.dir}/${component.name}`;

    // read the component.json file
    const componentJson: TComponentsComponentJson = __readJsonSync(
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
          case 'checkbox':
            if (!options.y) {
              answer = await __inquier.prompt({
                type: subset.type,
                default: this.settings.defaults[subsetCategory],
                name: subsetCategory,
                message: subset.question,
                choices: subset.choices,
              });
            } else {
              answer = {
                [subsetCategory]: this.settings.defaults[subsetCategory],
              };
            }
            break;
        }

        // set in defaults to maintain the user choices across components
        this.settings.defaults[subsetCategory] = answer[subsetCategory];

        // handle answer
        let finalAnswer: any = {};
        if (Array.isArray(answer[subsetCategory])) {
          // extend the final answer with the subset components
          for (let a of answer[subsetCategory]) {
            for (let [key, value] of Object.entries(subset.component[a])) {
              if (Array.isArray(value)) {
                finalAnswer[key] = __unique([
                  ...(finalAnswer[key] ?? []),
                  ...value,
                ]);
              } else if (typeof value === 'object') {
                finalAnswer[key] = {
                  ...finalAnswer[key],
                  ...value,
                };
              } else {
                finalAnswer[key] = value;
              }
            }
          }
        } else {
          finalAnswer = answer[subsetCategory];
        }

        // get the "files" from the finalAnswer
        // that contains all the files to copy
        files = finalAnswer.files ?? files;
        if (!Array.isArray(files)) {
          files = [files];
        }

        // handle components dependencies on subset level
        if (finalAnswer.dependencies) {
          component.extendsDependencies(finalAnswer.dependencies);
        }

        // handle composerJson from subset
        if (finalAnswer.composerJson) {
          component.extendsComposerJson(finalAnswer.composerJson);
        }

        // handle packageJson from subset
        if (finalAnswer.packageJson) {
          component.extendsPackageJson(finalAnswer.packageJson);
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

    // handle components dependencies on root level
    if (component.dependencies) {
      for (let [name, dep] of Object.entries(component.dependencies)) {
        switch (dep.type) {
          case 'component':
            const res = await this.addComponent(name, options, true);
            if (res) {
              addedComponents = [...addedComponents, ...res.addedComponents];
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

    // finalize component
    await component.finalizeComponent();

    return {
      component,
      addedComponents,
    };
  }
}
