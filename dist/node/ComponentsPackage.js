import { __existsSync } from '@lotsof/sugar/fs';
import { globSync as __globSync } from 'glob';
import { __readJsonSync } from '@lotsof/sugar/fs';
import __ComponentsComponent from './ComponentsComponent.js';
export default class ComponentsPackage {
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const dependencies = {};
        if (this.componentsJson.dependencies) {
            for (let [name, dep] of Object.entries(this.componentsJson.dependencies)) {
                dependencies[name] = {
                    name,
                    type: 'component',
                    version: dep,
                };
            }
        }
        const npmDependencies = Object.assign(Object.assign(Object.assign({}, ((_b = (_a = this.componentsJson.packageJson) === null || _a === void 0 ? void 0 : _a.dependencies) !== null && _b !== void 0 ? _b : {})), ((_d = (_c = this.componentsJson.packageJson) === null || _c === void 0 ? void 0 : _c.devDependencies) !== null && _d !== void 0 ? _d : {})), ((_f = (_e = this.componentsJson.packageJson) === null || _e === void 0 ? void 0 : _e.globalDependencies) !== null && _f !== void 0 ? _f : {}));
        if (Object.keys(npmDependencies).length) {
            for (let [name, dep] of Object.entries(npmDependencies)) {
                dependencies[name] = {
                    name,
                    type: 'npm',
                    version: dep,
                };
            }
        }
        const composerDependencies = Object.assign(Object.assign({}, ((_h = (_g = this.componentsJson.composerJson) === null || _g === void 0 ? void 0 : _g.require) !== null && _h !== void 0 ? _h : {})), ((_k = (_j = this.componentsJson.composerJson) === null || _j === void 0 ? void 0 : _j['require-dev']) !== null && _k !== void 0 ? _k : {}));
        if (Object.keys(composerDependencies).length) {
            for (let [name, dep] of Object.entries(composerDependencies)) {
                dependencies[name] = {
                    name,
                    type: 'composer',
                    version: dep,
                };
            }
        }
        return dependencies;
    }
    constructor(rootDir, settings) {
        this._settings = settings;
        this._rootDir = rootDir;
        this._componentsJson = __readJsonSync(`${this.rootDir}/components.json`);
    }
    getComponents() {
        var _a;
        // reading the "components.json" file
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
        return componentsList;
    }
}
//# sourceMappingURL=ComponentsPackage.js.map