var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __childProcess from 'child_process';
import __ComponentsDependency from './ComponentsDependency.js';
import { __existsSync } from '@lotsof/sugar/fs';
import { globSync as __globSync } from 'glob';
import { __readJsonSync } from '@lotsof/sugar/fs';
import __ComponentsComponent from './ComponentsComponent.js';
export default class ComponentsLibrary {
    get settings() {
        return this._settings;
    }
    get componentsJson() {
        return this._componentsJson;
    }
    get name() {
        return this._componentsJson.name;
    }
    get description() {
        var _a;
        return (_a = this._componentsJson.description) !== null && _a !== void 0 ? _a : this.name;
    }
    get rootDir() {
        return this._rootDir;
    }
    get version() {
        return this._componentsJson.version;
    }
    get dependencies() {
        return this._dependencies;
    }
    constructor(rootDir, settings) {
        this._dependencies = {};
        this.updated = false;
        this._settings = settings;
        this._rootDir = rootDir;
        this._componentsJson = __readJsonSync(`${this.rootDir}/componentsLibrary.json`);
        this._addDependencies();
    }
    getComponents() {
        var _a;
        // reading the "componentsLibrary.json" file
        const componentsList = {};
        // check if we have the "components.folders" settings
        let folders = ['src/components/*'];
        if ((_a = this.componentsJson) === null || _a === void 0 ? void 0 : _a.folders) {
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
                const component = new __ComponentsComponent(`${this.rootDir}/${componentPath}`, this, {
                    $components: this.settings.$components,
                });
                componentsList[`${this.name}/${component.name}`] = component;
            }
        }
        // sort alphabetically
        const sorted = Object.keys(componentsList).sort();
        const sortedComponentsList = {};
        for (let key of sorted) {
            sortedComponentsList[key] = componentsList[key];
        }
        // return sorted list
        return sortedComponentsList;
    }
    _addDependencies() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (this.componentsJson.dependencies) {
            for (let [name, dep] of Object.entries((_a = this.componentsJson.dependencies) !== null && _a !== void 0 ? _a : {})) {
                const dependency = new __ComponentsDependency({
                    type: 'component',
                    level: 'library',
                    name,
                    version: dep,
                });
                this.addDependency(dependency);
            }
        }
        const npmDependencies = Object.assign(Object.assign(Object.assign({}, ((_d = (_c = (_b = this.componentsJson) === null || _b === void 0 ? void 0 : _b.packageJson) === null || _c === void 0 ? void 0 : _c.dependencies) !== null && _d !== void 0 ? _d : {})), ((_g = (_f = (_e = this.componentsJson) === null || _e === void 0 ? void 0 : _e.packageJson) === null || _f === void 0 ? void 0 : _f.devDependencies) !== null && _g !== void 0 ? _g : {})), ((_k = (_j = (_h = this.componentsJson) === null || _h === void 0 ? void 0 : _h.packageJson) === null || _j === void 0 ? void 0 : _j.globalDependencies) !== null && _k !== void 0 ? _k : {}));
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
        const composerDependencies = Object.assign(Object.assign({}, ((_m = (_l = this.componentsJson.composerJson) === null || _l === void 0 ? void 0 : _l.require) !== null && _m !== void 0 ? _m : {})), ((_p = (_o = this.componentsJson.composerJson) === null || _o === void 0 ? void 0 : _o['require-dev']) !== null && _p !== void 0 ? _p : {}));
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
    hasDependencies() {
        return Object.keys(this._dependencies).length > 0;
    }
    addDependency(dependency) {
        this._dependencies[dependency.name] = dependency;
    }
    installDependencies() {
        return __awaiter(this, arguments, void 0, function* (type = ['npm', 'composer']) {
            let installedDependencies = [];
            if (Array.isArray(type) && !type.length) {
                return [];
            }
            if (Array.isArray(type)) {
                for (let t of type) {
                    const dep = yield this.installDependencies(t);
                    installedDependencies = Object.assign(Object.assign({}, installedDependencies), dep);
                }
                return installedDependencies;
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                for (let [name, dep] of Object.entries(this.dependencies)) {
                    if (type !== dep.type) {
                        continue;
                    }
                    yield dep.install();
                    installedDependencies.push(dep);
                }
                resolve(installedDependencies);
            }));
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            // get the componentsLibrary.json file from the updated component
            const componentsJson = __readJsonSync(`${this.settings.$components.libraryRootDir}/${this.name}/componentsLibrary.json`);
            // check dependencies
            for (let [name, sourceSettings] of Object.entries((_a = componentsJson.dependencies) !== null && _a !== void 0 ? _a : {})) {
                // if source already registered, avoid continue
                const libraries = this.settings.$components.getLibraries();
                let newSource = libraries[name];
                if (!libraries[name]) {
                    // register new library
                    newSource = (_b = this.settings.$components) === null || _b === void 0 ? void 0 : _b.registerLibraryFromSettings(sourceSettings);
                }
                // cloning the repo
                const res = yield __childProcess.spawnSync(`git clone ${this.settings.url} ${this.settings.$components.libraryRootDir}/${this.name}`, [], {
                    shell: true,
                });
                const output = (_d = (_c = res.output) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '';
                this.updated = !output.match(/already exists/);
                if (output.includes('already exists')) {
                    // try to pull the repo
                    const pullRes = yield __childProcess.spawnSync(`git pull`, [], {
                        cwd: `${this.settings.$components.libraryRootDir}/${this.name}`,
                        shell: true,
                    });
                    const pullOutput = (_f = (_e = pullRes.output) === null || _e === void 0 ? void 0 : _e.toString().split(',').join('')) !== null && _f !== void 0 ? _f : '';
                    this.updated = !pullOutput.match(/Already up to date/);
                }
                // updating new source
                yield (newSource === null || newSource === void 0 ? void 0 : newSource.update());
            }
            return {
                updated: this.updated,
            };
        });
    }
}
//# sourceMappingURL=ComponentsLibrary.js.map