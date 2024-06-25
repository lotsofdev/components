var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __addPackageDependencies } from '@lotsof/sugar/package';
import { __copySync, __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentsComponent {
    get settings() {
        return this._settings;
    }
    get name() {
        return this._componentJson.name;
    }
    get description() {
        var _a;
        return (_a = this._componentJson.description) !== null && _a !== void 0 ? _a : this.name;
    }
    get package() {
        return this._package;
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
        this._package = pkg;
        this._rootDir = rootDir;
        this._componentJson = __readJsonSync(`${this.rootDir}/component.json`);
        this._addDependencies();
    }
    setRootDir(rootDir) {
        this._rootDir = rootDir;
    }
    copyToSync(destDir) {
        __copySync(this.rootDir, destDir);
        this._rootDir = destDir;
    }
    _addDependencies() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        console.log(this.componentJson);
        if (this.componentJson.dependencies) {
            for (let [name, dep] of Object.entries((_a = this.componentJson.dependencies) !== null && _a !== void 0 ? _a : {})) {
                this.addDependency(name, {
                    name,
                    type: 'component',
                    version: dep,
                });
            }
        }
        const npmDependencies = Object.assign(Object.assign(Object.assign({}, ((_d = (_c = (_b = this.componentJson) === null || _b === void 0 ? void 0 : _b.packageJson) === null || _c === void 0 ? void 0 : _c.dependencies) !== null && _d !== void 0 ? _d : {})), ((_g = (_f = (_e = this.componentJson) === null || _e === void 0 ? void 0 : _e.packageJson) === null || _f === void 0 ? void 0 : _f.devDependencies) !== null && _g !== void 0 ? _g : {})), ((_k = (_j = (_h = this.componentJson) === null || _h === void 0 ? void 0 : _h.packageJson) === null || _j === void 0 ? void 0 : _j.globalDependencies) !== null && _k !== void 0 ? _k : {}));
        if (Object.keys(npmDependencies).length) {
            for (let [name, dep] of Object.entries(npmDependencies)) {
                this.addDependency(name, {
                    name,
                    type: 'npm',
                    version: dep,
                });
            }
        }
        const composerDependencies = Object.assign(Object.assign({}, ((_m = (_l = this.componentJson.composerJson) === null || _l === void 0 ? void 0 : _l.require) !== null && _m !== void 0 ? _m : {})), ((_p = (_o = this.componentJson.composerJson) === null || _o === void 0 ? void 0 : _o['require-dev']) !== null && _p !== void 0 ? _p : {}));
        if (Object.keys(composerDependencies).length) {
            for (let [name, dep] of Object.entries(composerDependencies)) {
                this.addDependency(name, {
                    name,
                    type: 'composer',
                    version: dep,
                });
            }
        }
    }
    hasDependencies() {
        console.log(this._dependencies);
        return Object.keys(this._dependencies).length > 0;
    }
    addDependency(name, dependency) {
        switch (dependency.type) {
            case 'component':
            case 'npm':
            case 'composer':
                this._dependencies[name] = dependency;
                break;
            default:
                throw new Error(`Unknown dependency type "${dependency.type}" for dependency "${name}"`);
                break;
        }
    }
    installDependencies() {
        return __awaiter(this, arguments, void 0, function* (type = ['npm', 'composer']) {
            if (Array.isArray(type) && !type.length) {
                return;
            }
            if (Array.isArray(type)) {
                for (let t of type) {
                    yield this.installDependencies(t);
                }
                return;
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                switch (type) {
                    case 'npm':
                        if ((_a = this.componentJson.packageJson) === null || _a === void 0 ? void 0 : _a.dependencies) {
                            console.log(`Adding and install dependencies for ${this.name} component...`);
                            yield __addPackageDependencies(this.componentJson.packageJson.dependencies, {
                                install: true,
                            });
                        }
                        if ((_b = this.componentJson.packageJson) === null || _b === void 0 ? void 0 : _b.devDependencies) {
                            console.log(`Adding and install devDependencies for ${this.name} component...`);
                            yield __addPackageDependencies(this.componentJson.packageJson.devDependencies, {
                                install: true,
                            });
                        }
                        if ((_c = this.componentJson.packageJson) === null || _c === void 0 ? void 0 : _c.globalDependencies) {
                            console.log(`Adding and install globalDependencies for ${this.name} component...`);
                            yield __addPackageDependencies(this.componentJson.packageJson.globalDependencies, {
                                install: true,
                            });
                        }
                        break;
                }
                resolve();
            }));
        });
    }
}
//# sourceMappingURL=ComponentsComponent.js.map