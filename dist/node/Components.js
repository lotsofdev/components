var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __inquier from 'inquirer';
import * as __glob from 'glob';
import { __getConfig } from '@lotsof/config';
import './Components.config.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';
import { __packageRootDir } from '@lotsof/sugar/package';
import { __copySync, __ensureDirSync, __existsSync, __readJsonSync, __removeSync, } from '@lotsof/sugar/fs';
import __path from 'path';
import { globSync as __globSync } from 'glob';
import ComponentPackage from './ComponentsPackage.js';
export default class Components {
    // public get stateFilePath(): string {
    //   return this.settings.stateFilePath ?? `$`;
    // }
    get libraryRootDir() {
        return this.settings.libraryRootDir;
    }
    constructor(settings) {
        var _a;
        this._sources = {};
        this.settings = Object.assign(Object.assign({}, ((_a = __getConfig('components.settings')) !== null && _a !== void 0 ? _a : {})), (settings !== null && settings !== void 0 ? settings : {}));
    }
    registerSourceFromSettings(settings) {
        let source;
        settings.$components = this;
        switch (settings.type) {
            case 'git':
                source = new ComponentGitSource(settings);
                break;
        }
        // @ts-ignore
        if (!source) {
            return;
        }
        return this.registerSource(source);
    }
    registerSource(source) {
        this._sources[source.id] = source;
        return this._sources[source.id];
    }
    getSources() {
        return this._sources;
    }
    updateSources() {
        return __awaiter(this, void 0, void 0, function* () {
            // updating sources
            const sources = this.getSources();
            for (let [sourceId, source] of Object.entries(sources)) {
                yield source.update();
            }
            return {
                sources: this.getSources(),
            };
        });
    }
    getPackages(sourceIds) {
        const packages = {};
        // list components in the root folder
        const lotsofJsonFiles = __globSync([
            `${this.libraryRootDir}/*/components.json`,
            `${this.libraryRootDir}/*/*/components.json`,
        ]);
        for (let [i, jsonPath] of lotsofJsonFiles.entries()) {
            const p = new ComponentPackage({
                rootDir: __path.dirname(jsonPath),
                $components: this,
            });
            packages[p.name] = p;
        }
        return packages;
    }
    getComponents(sourceIds) {
        let componentsList = {};
        const packages = this.getPackages(sourceIds);
        for (let [packageName, p] of Object.entries(packages)) {
            const components = p.getComponents();
            componentsList = Object.assign(Object.assign({}, componentsList), components);
        }
        return componentsList;
    }
    addComponent(componentId_1, options_1) {
        return __awaiter(this, arguments, void 0, function* (componentId, options, isDependency = false) {
            options = Object.assign({ dir: `${__packageRootDir()}/src/components`, y: false, override: false }, (options !== null && options !== void 0 ? options : {}));
            // get components list
            const components = yield this.getComponents();
            if (!components[componentId]) {
                console.log(`Component <yellow>${componentId}</yellow> not found.`);
                return;
            }
            let component = components[componentId], finalComponentName = component.name, componentDestinationDir = `${options.dir}/${component.name}`;
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
                console.log(`<red>Overriding</red> the component "<yellow>${component.name}</yellow>"...`);
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
                const newNameResponse = yield __inquier.prompt({
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
            }
            else {
                let answer, files = [], copyMap = {};
                // add the "files" to the copy map
                if (componentJson.files) {
                    for (let file of componentJson.files) {
                        const resolvedFiles = __glob.sync(`${component.path}/${file}`);
                        for (let resolvedFile of resolvedFiles) {
                            const relPath = resolvedFile.replace(`${component.path}/`, '');
                            copyMap[resolvedFile] = `${options.dir}/${component.name}/${relPath}`;
                        }
                    }
                }
                // copy only the subset of the component
                for (let [subsetCategory, subset] of Object.entries(componentJson.subset)) {
                    switch (subset.type) {
                        case 'list':
                            answer = yield __inquier.prompt({
                                type: 'list',
                                default: subsetCategory === 'engine'
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
                            copyMap[resolvedFile] = `${options.dir}/${component.name}/${relPath}`;
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
                const dependencies = {};
                component.dependencies = dependencies;
                for (let [dependencyId, version] of Object.entries(componentJson.dependencies)) {
                    const dependendiesRes = yield this.addComponent(dependencyId, options, true);
                    if (dependendiesRes) {
                        component.dependencies[dependencyId] = dependendiesRes.component;
                    }
                }
            }
            return {
                component,
            };
        });
    }
}
//# sourceMappingURL=Components.js.map