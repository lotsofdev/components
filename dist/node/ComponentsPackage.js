import { __existsSync } from '@lotsof/sugar/fs';
import { globSync as __globSync } from 'glob';
import { __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentPackage {
    get name() {
        return this.componentsJson.name;
    }
    get description() {
        var _a;
        return (_a = this.componentsJson.description) !== null && _a !== void 0 ? _a : this.name;
    }
    get rootDir() {
        return this._rootDir;
    }
    get version() {
        return this.componentsJson.version;
    }
    get dependencies() {
        var _a, _b, _c, _d, _e;
        const dependencies = {};
        if (this.componentsJson.dependencies) {
            for (let [name, dep] of Object.entries(this.componentsJson.dependencies)) {
                dependencies[name] = {
                    type: 'component',
                    version: dep,
                };
            }
        }
        const npmDependencies = Object.assign(Object.assign(Object.assign({}, ((_a = this.componentsJson.packageJson.dependencies) !== null && _a !== void 0 ? _a : {})), ((_b = this.componentsJson.packageJson.devDependencies) !== null && _b !== void 0 ? _b : {})), ((_c = this.componentsJson.packageJson.globalDependencies) !== null && _c !== void 0 ? _c : {}));
        if (Object.keys(npmDependencies).length) {
            for (let [name, dep] of Object.entries(npmDependencies)) {
                dependencies[name] = {
                    type: 'npm',
                    version: dep,
                };
            }
        }
        const composerDependencies = Object.assign(Object.assign({}, ((_d = this.componentsJson.composerJson.require) !== null && _d !== void 0 ? _d : {})), ((_e = this.componentsJson.composerJson['require-dev']) !== null && _e !== void 0 ? _e : {}));
        if (Object.keys(composerDependencies).length) {
            for (let [name, dep] of Object.entries(composerDependencies)) {
                dependencies[name] = {
                    type: 'composer',
                    version: dep,
                };
            }
        }
        return dependencies;
    }
    constructor(rootDir, settings) {
        this.settings = settings;
        this._rootDir = rootDir;
        // reading the "components.json" file
        this.componentsJson = __readJsonSync(`${this.rootDir}/components.json`);
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
                const componentJson = __readJsonSync(componentJsonPath);
                componentJson.package = this;
                componentJson.path = `${this.rootDir}/${componentPath}`;
                componentJson.relPath = componentPath;
                componentsList[`${this.name}/${componentJson.name}`] = componentJson;
            }
        }
        return componentsList;
    }
}
//# sourceMappingURL=ComponentsPackage.js.map