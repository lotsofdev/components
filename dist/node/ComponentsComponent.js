var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __ComponentsDependency from './ComponentsDependency.js';
import { globSync as __globSync } from 'glob';
import __fs from 'fs';
import __path from 'path';
import { __copySync, __readJsonSync, __renameSync } from '@lotsof/sugar/fs';
import { __deepMerge } from '@lotsof/sugar/object';
import { __capitalCase, __constantCase, __dashCase, __dotCase, __kebabCase, __pascalCase, __snakeCase, __trainCase, } from '@lotsof/sugar/string';
import __camelCase from '../../../sugar/dist/shared/string/camelize.js';
export default class ComponentsComponent {
    get settings() {
        return this._settings;
    }
    get name() {
        var _a;
        return (_a = this._newName) !== null && _a !== void 0 ? _a : this._componentJson.name;
    }
    get description() {
        var _a;
        return (_a = this._componentJson.description) !== null && _a !== void 0 ? _a : this.name;
    }
    get library() {
        return this._library;
    }
    get componentJson() {
        return this._componentJson;
    }
    get rootDir() {
        return this._rootDir;
    }
    get version() {
        return this._componentJson.version;
    }
    get dependencies() {
        return this._dependencies;
    }
    constructor(rootDir, pkg, settings) {
        this._dependencies = {};
        this._settings = settings;
        this._library = pkg;
        this._rootDir = rootDir;
        this._componentJson = __readJsonSync(`${this.rootDir}/component.json`);
        this._originalName = this.componentJson.name;
        this._updateDependencies();
    }
    finalizeComponent() {
        return __awaiter(this, void 0, void 0, function* () {
            // list all the files in the component
            const filesPaths = __globSync(`**/*`, {
                cwd: this.rootDir,
                nodir: true,
            });
            for (let relFilePath of filesPaths) {
                const filePath = `${this.rootDir}/${relFilePath}`;
                // do not touch files that does not start with the component name
                const nameReg = new RegExp(`^${this._originalName}`);
                if (!__path.basename(filePath).match(nameReg)) {
                    continue;
                }
                // read the file content
                let content = __fs.readFileSync(filePath, 'utf8');
                // replace the component name in the file content
                // @ts-ignore
                content = content.replaceAll(__camelCase(this._originalName), __camelCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__dashCase(this._originalName), __dashCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__capitalCase(this._originalName), __capitalCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__constantCase(this._originalName), __constantCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__dotCase(this._originalName), __dotCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__kebabCase(this._originalName), __kebabCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__snakeCase(this._originalName), __snakeCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__trainCase(this._originalName), __trainCase(this.name));
                // @ts-ignore
                content = content.replaceAll(__pascalCase(this._originalName), __pascalCase(this.name));
                // write the new file content
                __fs.writeFileSync(filePath, content);
                // rename the file
                __renameSync(filePath, this.name);
            }
        });
    }
    setRootDir(rootDir) {
        this._rootDir = rootDir;
    }
    setName(name) {
        this._newName = name;
    }
    copyToSync(destDir) {
        __copySync(this.rootDir, destDir);
        this._rootDir = destDir;
    }
    extendsDependencies(dependencies) {
        var _a;
        this._componentJson.dependencies = __deepMerge((_a = this._componentJson.dependencies) !== null && _a !== void 0 ? _a : {}, dependencies !== null && dependencies !== void 0 ? dependencies : {});
        this._updateDependencies();
    }
    extendsComposerJson(composerJson) {
        var _a;
        this._componentJson.composerJson = __deepMerge((_a = this._componentJson.composerJson) !== null && _a !== void 0 ? _a : {}, composerJson !== null && composerJson !== void 0 ? composerJson : {});
        this._updateDependencies();
    }
    extendsPackageJson(packageJson) {
        var _a;
        this._componentJson.packageJson = __deepMerge((_a = this._componentJson.packageJson) !== null && _a !== void 0 ? _a : {}, packageJson !== null && packageJson !== void 0 ? packageJson : {});
        this._updateDependencies();
    }
    _updateDependencies() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        this._dependencies = {};
        if (this.componentJson.dependencies) {
            for (let [name, dep] of Object.entries((_a = this.componentJson.dependencies) !== null && _a !== void 0 ? _a : {})) {
                const dependency = new __ComponentsDependency({
                    type: 'component',
                    level: 'component',
                    name,
                    version: dep,
                });
                this.addDependency(dependency);
            }
        }
        const npmDependencies = Object.assign(Object.assign(Object.assign({}, ((_d = (_c = (_b = this.componentJson) === null || _b === void 0 ? void 0 : _b.packageJson) === null || _c === void 0 ? void 0 : _c.dependencies) !== null && _d !== void 0 ? _d : {})), ((_g = (_f = (_e = this.componentJson) === null || _e === void 0 ? void 0 : _e.packageJson) === null || _f === void 0 ? void 0 : _f.devDependencies) !== null && _g !== void 0 ? _g : {})), ((_k = (_j = (_h = this.componentJson) === null || _h === void 0 ? void 0 : _h.packageJson) === null || _j === void 0 ? void 0 : _j.globalDependencies) !== null && _k !== void 0 ? _k : {}));
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
        const composerDependencies = Object.assign(Object.assign({}, ((_m = (_l = this.componentJson.composerJson) === null || _l === void 0 ? void 0 : _l.require) !== null && _m !== void 0 ? _m : {})), ((_p = (_o = this.componentJson.composerJson) === null || _o === void 0 ? void 0 : _o['require-dev']) !== null && _p !== void 0 ? _p : {}));
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
}
//# sourceMappingURL=ComponentsComponent.js.map