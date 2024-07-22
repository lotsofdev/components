var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as __glob from 'glob';
import __inquier from 'inquirer';
import { __getConfig } from '@lotsof/config';
import './Components.config.js';
import { __packageRootDir } from '@lotsof/sugar/package';
import { __copySync, __ensureDirSync, __existsSync, __readJsonSync, } from '@lotsof/sugar/fs';
import __path from 'path';
import { globSync as __globSync } from 'glob';
import __ComponentLibrary from './ComponentsLibrary.js';
import { __ComponentsLibrary } from './_exports.js';
export default class Components {
    get libraryRootDir() {
        return this.settings.libraryRootDir;
    }
    constructor(settings) {
        var _a;
        this._libraries = {};
        this.settings = Object.assign(Object.assign({}, ((_a = __getConfig('components.settings')) !== null && _a !== void 0 ? _a : {})), (settings !== null && settings !== void 0 ? settings : {}));
    }
    registerLibraryFromSettings(settings) {
        settings.$components = this;
        const library = new __ComponentsLibrary(`${this.libraryRootDir}/${settings.name}`, settings);
        return this.registerLibrary(library);
    }
    registerLibrary(library) {
        this._libraries[library.name] = library;
        return this._libraries[library.name];
    }
    get libraries() {
        return this._libraries;
    }
    updateLibraries() {
        return __awaiter(this, void 0, void 0, function* () {
            // updating libraries
            const libraries = this.getLibraries();
            for (let [libraryName, library] of Object.entries(libraries)) {
                yield library.update();
            }
            return {
                libraries,
            };
        });
    }
    getLibraries() {
        var _a;
        const libraries = {};
        // list components in the root folder
        const componentsJsonFiles = __globSync([
            `${this.libraryRootDir}/*/componentsLibrary.json`,
            `${this.libraryRootDir}/*/*/componentsLibrary.json`,
        ]);
        for (let [i, jsonPath] of componentsJsonFiles.entries()) {
            const componentsJson = __readJsonSync(jsonPath);
            const p = new __ComponentLibrary(__path.dirname(jsonPath), {
                type: (_a = componentsJson.type) !== null && _a !== void 0 ? _a : 'git',
                url: componentsJson.url,
                name: componentsJson.name,
                $components: this,
            });
            libraries[p.name] = p;
        }
        return libraries;
    }
    getComponents(sourceIds) {
        let componentsList = {};
        const libraries = this.getLibraries(sourceIds);
        for (let [libraryName, p] of Object.entries(libraries)) {
            const components = p.getComponents();
            componentsList = Object.assign(Object.assign({}, componentsList), components);
        }
        return componentsList;
    }
    addComponent(componentId_1, options_1) {
        return __awaiter(this, arguments, void 0, function* (componentId, options, isDependency = false) {
            var _a;
            options = Object.assign({ dir: `${__packageRootDir()}/src/components`, y: false }, (options !== null && options !== void 0 ? options : {}));
            // get components list
            const components = yield this.getComponents();
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
            let addedComponents = [component], componentDestinationDir = `${options.dir}/${component.name}`;
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
                let proposedName = component.name, proposedNameI = 0;
                while (__existsSync(`${options.dir}/${proposedName}`)) {
                    proposedNameI++;
                    proposedName = `${component.name}${proposedNameI}`;
                }
                // otherwise, ask for a new name
                if (!options.y) {
                    const newNameResponse = yield __inquier.prompt({
                        type: 'input',
                        name: 'newName',
                        default: proposedName,
                        message: `The component "${component.name}${proposedNameI - 1}" already exists. Specify a new name for your component`,
                    });
                    if (newNameResponse.newName) {
                        component.setName(newNameResponse.newName);
                    }
                }
                else {
                    component.setName(proposedName);
                }
            }
            // ensure the directory exists
            __ensureDirSync(options.dir);
            // copy the component to the specified directory
            componentDestinationDir = `${options.dir}/${component.name}`;
            // read the component.json file
            const componentJson = __readJsonSync(`${component.rootDir}/component.json`);
            // copy the component to the specified directory
            if (!componentJson.subset) {
                // copy the entire component
                component.copyToSync(componentDestinationDir);
            }
            else {
                let answer, files = [], copyMap = {};
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
                for (let [subsetCategory, subset] of Object.entries(componentJson.subset)) {
                    switch (subset.type) {
                        case 'list':
                        case 'checkbox':
                            if (!options.y) {
                                answer = yield __inquier.prompt({
                                    type: subset.type,
                                    default: subsetCategory === 'engine'
                                        ? this.settings.defaults.engine
                                        : null,
                                    name: subsetCategory,
                                    message: subset.question,
                                    choices: subset.choices,
                                });
                            }
                            else {
                                answer = {
                                    [subsetCategory]: subsetCategory === 'engine'
                                        ? this.settings.defaults.engine
                                        : null,
                                };
                            }
                            break;
                    }
                    // handle answer
                    answer = answer[subsetCategory];
                    const componentAnswer = subset.component[answer];
                    // get the "files" from the componentAnswer
                    // that contains all the files to copy
                    files = (_a = componentAnswer.files) !== null && _a !== void 0 ? _a : files;
                    if (!Array.isArray(files)) {
                        files = [files];
                    }
                    // handle components dependencies on subset level
                    if (componentAnswer.dependencies) {
                        component.extendsDependencies(componentAnswer.dependencies);
                    }
                    // handle composerJson from subset
                    if (componentAnswer.composerJson) {
                        component.extendsComposerJson(componentAnswer.composerJson);
                    }
                    // handle packageJson from subset
                    if (componentAnswer.packageJson) {
                        component.extendsPackageJson(componentAnswer.packageJson);
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
                            const res = yield this.addComponent(name, options, true);
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
                console.log(`▓ Component <yellow>${addedComponent.library.name}/${addedComponent.name}</yellow>`);
                // install library level dependencies
                yield addedComponent.library.installDependencies();
                // install component level dependencies
                yield addedComponent.installDependencies();
            }
            // finalize component
            yield component.finalizeComponent();
            return {
                component,
                addedComponents,
            };
        });
    }
}
//# sourceMappingURL=Components.js.map